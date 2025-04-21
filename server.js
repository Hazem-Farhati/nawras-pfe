const express = require("express");
const cors = require("cors");
const db_connect = require("./config/db_connect");
require("dotenv").config();
const path = require("path");
const multer = require("multer");

const app = express();

//connect to database
db_connect();
app.use(express.json());
//add cors
app.use(cors());
app.use("/files", express.static(path.join(__dirname, "upload/files")));

// Setup routes
// Serve static files in "uploads" folder
app.use("/uploads", express.static("uploads"));

//our routes

app.use("/user", require("./routes/userRoute"));
app.use("/dataCom", require("./routes/dataComRoute"));

//get port from .env
PORT = process.env.PORT;

//test our server
app.listen(PORT, (err) =>
  err ? console.log(err) : console.log("server is running")
);
