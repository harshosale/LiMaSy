const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  author: {
    required: true,
    type: String,
  },
  availability: {
    required: true,
    type: Boolean,
  },
  status: {
    required: true,
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Books", bookSchema);
