const express = require("express");
const TransactionModel = require("../models/transactions");
const UserModel = require("../models/users");
const BookModel = require("../models/books");
const { validateToken } = require("../utils");

const router = express.Router();

router.post("/", async (req, res) => {
  const transaction = new TransactionModel({
    user: await UserModel.findById(req.body.user_id),
    book: await BookModel.findById(req.body.book_id),
    due_date: Date(req.body.due_date),
    type: req.body.type,
  });

  try {
    const response = await transaction.save();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  const limit = req.query.limit || 10;
  const skip = req.query.skip || 0;

  try {
    const response = await TransactionModel.find({ status: true })
      .limit(limit)
      .skip(skip);
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/user-transactions", validateToken, async (req, res) => {
  try {
    const response = await TransactionModel.find({
      "user._id": req.user.id,
    });
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const response = await TransactionModel.findById(req.params.id);
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  const options = { new: true };
  try {
    const response = await TransactionModel.findByIdAndUpdate(
      id,
      updatedData,
      options
    );
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    // const response = await TransactionModel.findByIdAndDelete(req.params.id);
    const response = await TransactionModel.findByIdAndUpdate(
      req.params.id,
      { status: false },
      { new: true }
    );
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
