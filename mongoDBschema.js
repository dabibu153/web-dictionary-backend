const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  origin: {
    type: String,
  },
  category: {
    type: Array,
  },
});

const oneWord = new mongoose.model("oneWord", wordSchema);

module.exports.oneWord = oneWord;
