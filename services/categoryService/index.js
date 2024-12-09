const express = require('express');
const dotenv = require("dotenv");
const cors = require("cors");
const dbConnect = require("./config/db");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
dbConnect();

// Middlewares
const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true
}
app.use(cors(corsOptions));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

const PORT = process.env.CATEGORY_PORT || 8021;

app.listen(PORT, () => {
    console.log(`Category service listening to port : ${PORT}`);
})