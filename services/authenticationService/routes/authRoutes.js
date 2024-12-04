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

// Registration route
router.post("/register", register);

// Login route
router.post("/login", login);

// Auth status route
router.get("/status", authStatus);

// Logout route
router.post("/logout", logout);

// 2fa setup
router.post("/2fa/setup", setUp2fa);

// Verify 2fa route
router.post("/2fa/verify", verify2fa);

// Reset 2fa route
router.post("/2fa/reset", reset2fa);

module.exports = router;