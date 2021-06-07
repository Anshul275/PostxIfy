const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");


// Adding cors
app.use(cors());

// This middleware runs whenever we hit any request
app.use(express.json());

dotenv.config();

// Import Routes - Middlewares
const postsRoute = require("./routes/posts");
const usersRoute = require("./routes/users");
const authRoute = require("./routes/auth");

// A middleware to divert to the requests-handling
app.use("/api/v1.0", authRoute);
app.use("/api/v1.0/users", usersRoute);
app.use("/api/v1.0/posts", postsRoute);

// CONNECT TO DB
mongoose.connect(
    process.env.DB_CONNECT,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    () => console.log("Connected to DB!")
);


const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`\nServer running on port ${PORT}`));