const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");
const express = require("express");

const app = express();

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PORT = process.env.AUTH_PORT || 8011;

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};

app.options('*', cors(corsOptions));

passport.use(new LocalStrategy({ usernameField: "email" },
    async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return done(null, false, { message: "Incorrect email." });
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: "Incorrect password." });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
)
);

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `http://localhost:${PORT}/api/auth/google/callback`,
            passReqToCallback: true,
            scope: ['profile', 'email']
        },
        async (request, accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });
                if (!user) {
                    user = await User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                    });
                }
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    console.log("We are inside serialize user");
    done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
    try {
        console.log("We are inside deserialize user");
        const user = await User.findById(_id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;