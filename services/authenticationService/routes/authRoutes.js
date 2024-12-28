const express = require("express");
const passport = require("passport");
const {
    register,
    login,
    googleLogin,
    authStatus,
    logout,
    setUp2fa,
    verify2fa,
    reset2fa
} = require("../controllers/authController");

const router = express.Router();
const authenticationCheck = require("../middlewares/authMiddleware");

// Registration route
router.post("/register", register);

// Login route
router.post("/login", passport.authenticate("local"), login);

// Google login
// router.post("/users/google-login", passport.authenticate("google", { scope: ['profile'] }), googleLogin);

// 1. Initiate Google Authentication
router.get("/google-login", passport.authenticate("google", { scope: ["profile", "email"] }));

// 2. Handle Callback from Google
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        const user = req.user;
        const userParam = encodeURIComponent(JSON.stringify(user));
        res.redirect(`http://localhost:3000/auth/google/callback?user=${userParam}`);
    }
);

// Auth status route
router.get("/status", authStatus);

// Logout route
router.post("/logout", logout);

// 2fa setup
router.post("/2fa/setup", authenticationCheck, setUp2fa);

// Verify 2fa route
router.post("/2fa/verify", authenticationCheck, verify2fa);

// Reset 2fa route
router.post("/2fa/reset", authenticationCheck, reset2fa);

module.exports = router;