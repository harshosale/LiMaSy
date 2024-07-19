const mongoose = require("mongoose");
const UserModel = require("./users");
const BookModel = require("./books");

const transactionSchema = new mongoose.Schema({
  user: {
    required: true,
    type: UserModel.schema,
  },
  book: {
    required: true,
    type: BookModel.schema,
  },
  due_date: {
    required: true,
    type: Date,
  },
  type: {
    required: true,
    type: String,
  },
  status: {
    required: true,
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Transactions", transactionSchema);
