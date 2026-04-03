const express = require("express");
const connectDB = require("./utils/db");

const app = express();
require("dotenv").config();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/add-user", require("./Routes/add.user"));
app.use("/api/add-attendance", require("./Routes/add.attendance"));
app.use("/api/get-todays-attendance", require("./Routes/get.todays.attendance"));

module.exports = app;