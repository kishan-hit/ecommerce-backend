const express = require("express");
const passport = require("passport");
const {
    register,
    login,
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