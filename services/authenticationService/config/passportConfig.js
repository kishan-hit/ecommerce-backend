const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/user");

passport.use(new LocalStrategy({ usernameField: "userName" },
    async (userName, password, done) => {
        try {
            const user = await User.findOne({ userName });
            if (!user) {
                return done(null, false, { message: "Incorrect username." });
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