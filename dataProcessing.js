const express = require("express");
const router = express.Router();
const { oneWord } = require("./mongoDBschema.js");

router.get("/getMongoData", async (req, res) => {});

router.post("/searchOxford", async (req, res) => {
  res.send("searchOxford link working");
});

module.exports = router;
