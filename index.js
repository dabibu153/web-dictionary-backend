const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const dataProcessing = require("./dataProcessing");

mongoose
  .connect("mongodb://localhost/dictionary")
  .then((res) => console.log("connected to DB..."))
  .catch((err) => console.log("something is wrong..."));

app.use(bodyParser.json());
app.use(cors());

app.all("/", (req, res) => {
  res.send("backend running");
});

app.use("/api", dataProcessing);

let port = 5000;

app.listen((PORT = process.env.PORT || port));
console.log("server started...");
