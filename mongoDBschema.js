const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  origin: {
    type: String,
  },
  lexicalCategory: {
    type: Array,
  },
});

const oneWord = new mongoose.model("oneWord", wordSchema);

module.exports.oneWord = oneWord;
