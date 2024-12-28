const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: function () {
                return !this.googleId;
            }
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true
        },
        name: {
            type: String
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
