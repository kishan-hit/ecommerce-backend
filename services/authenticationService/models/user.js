const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        is2faActive: {
            type: Boolean,
            default: false
        },
        twoFactorSecret: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
