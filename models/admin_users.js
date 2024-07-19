const mongoose = require("mongoose");

const adminUserSchema = new mongoose.Schema({
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
  password: {
    required: true,
    type: String,
  },
  status: {
    required: true,
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("AdminUsers", adminUserSchema);
