require("dotenv").config;
const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        const mongoDbConnection = await mongoose.connect(process.env.CATEGORY_MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Category database connected at port ${mongoDbConnection.connection.port}`);
    } catch (err) {
        console.log(`Category database connection failed ${err}`);
        process.exit(1);
    }
}

module.exports = dbConnect;