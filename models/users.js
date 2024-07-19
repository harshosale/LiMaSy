const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  phone: {
    required: true,
    type: Number,
  },
  status: {
    required: true,
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Users", userSchema);
