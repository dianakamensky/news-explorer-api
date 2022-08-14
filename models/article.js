const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.ObjectId,
    select: false,
  },
});

module.exports = mongoose.model("article", articleSchema);
