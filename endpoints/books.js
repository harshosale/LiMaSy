const express = require("express");
const BookModel = require("../models/books");
const router = express.Router();

router.post("/", async (req, res) => {
  const book = new BookModel({
    name: req.body.name,
    author: req.body.author,
    availability: req.body.availability,
  });

  try {
    const response = await book.save();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  const limit = req.query.limit || 10;
  const skip = req.query.skip || 0;

  try {
    const response = await BookModel.find({ status: true })
      .limit(limit)
      .skip(skip);
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const response = await BookModel.findById(req.params.id);
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
    const response = await BookModel.findByIdAndUpdate(
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
    // const response = await BookModel.findByIdAndDelete(req.params.id);
    const response = await BookModel.findByIdAndUpdate(
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
