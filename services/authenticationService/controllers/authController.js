const bcrypt = require("bcryptjs");
const User = require("../models/user");

const register = async (req, res) => {
    try {
        const {userName, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            userName,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({message: "User registered successfully"});
    } catch (error) {
        res.status(500).json({error: "Error in registering user", message: error})
    }
}

const login = async () => {

}

const authStatus = async () => {

}

const logout = async () => {

}

const setUp2fa = async () => {

}

const verify2fa = async () => {

}

const reset2fa = async () => {

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