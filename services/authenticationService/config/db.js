require("dotenv").config;
const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.AUTH_MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Auth database connected");
    } catch (err) {
        console.log(`Auth database connection failed ${err}`);
        process.exit(1);
    }
}

module.exports = dbConnect;