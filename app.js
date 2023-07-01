const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use("/user", userRoutes);
app.use("/posts", postRoutes);

module.exports = app;
