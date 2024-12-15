const bcrypt = require("bcryptjs");
const speakEasy = require("speakeasy");
const QRCode = require("qrcode");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error in registering user", message: error })
    }
}

const login = async (req, res) => {
    console.log(`The authenticated user is : ${req.user}`);
    res.status(200).json({
        message: "User logged in successfully",
        email: req.user.email,
        is2faActive: req.user.is2faActive
    });
}

const authStatus = async (req, res) => {
    if (!req.user) {
        return res.status(400).json({ message: "Unauthorized user" });
    }
    res.status(200).json({
        message: "User logged in successfully",
        email: req.user.email,
        is2faActive: req.user.is2faActive
    })
}

const logout = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized user" });
    }
    req.logout((err) => {
        if (err) {
            return res.status(400).json({ message: "User not logged in" });
        }
        res.status(200).json({ message: "USer logged out successfully " });
    })
}

const setUp2fa = async (req, res) => {
    try {
        const user = req.user;
        const secret = speakEasy.generateSecret();
        user.twoFactorSecret = secret.base32;
        user.is2faActive = true;
        await user.save();
        const url = speakEasy.otpauthURL({
            secret: secret.base32,
            label: `${req.user.email}`,
            issuer: "Kishan",
            encoding: "base32"
        });
        const QRImageUrl = await QRCode.toDataURL(url);
        res.status(200).json({
            secret: secret.base32,
            QRCode: QRImageUrl
        })
    } catch (error) {
        res.status(200).json({ error: "Error in setting up 2FA", message: error })
    }
}

const verify2fa = async (req, res) => {
    const { token } = req.body;
    const user = req.user;

    const verified = speakEasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token,
    });
    if (verified) {
        const jwtToken = jwt.sign(
            { email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1hr" }
        );
        res.status(200).json({ message: "2FA successful", token: jwtToken });
    } else {
        res.status(400).json({ message: "Invalid 2FA token" });
    }
}

const reset2fa = async (req, res) => {
    try {
        const user = req.user;
        user.twoFactorSecret = "";
        user.is2faActive = false;
        await user.save();
        res.status(200).json({ message: "2FA reset done" })
    } catch (error) {
        res.status(500).json({ error: "Error resetting 2FA", message: error });
    }
}

module.exports = {
    register,
    login,
    authStatus,
    logout,
    setUp2fa,
    verify2fa,
    reset2fa
}