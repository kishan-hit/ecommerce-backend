const express = require("express");
const session = require("express-session");
const passport = require("passport");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Middlewares
const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true
}
app.use(cors(corsOptions));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000 * 60
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes

const PORT = process.env.AUTH_PORT || 8011;

app.listen(PORT, () => {
    console.log(`Auth service listeing to port : ${PORT}`);
})
