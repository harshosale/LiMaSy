const express = require("express");

const UserModel = require("../models/users");
const AdminUserModel = require("../models/admin_users");
const { validateToken, hashPassword } = require("../utils");

const router = express.Router();

router.post("/", async (req, res) => {
  const isAdmin = req.body.isAdmin;
  let user;
  let data = {
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    username: req.body.username,
  };

  if (isAdmin) {
    let password = await hashPassword(req.body.password);
    user = new AdminUserModel({
      ...data,
      password,
    });
  } else {
    user = new UserModel(data);
  }

  try {
    const response = await user.save();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  const limit = req.query.limit || 10;
  const skip = req.query.skip || 0;
  const isAdmin = req.user.isAdmin;

  let response;
  try {
    if (isAdmin) {
      response = await AdminUserModel.find({ status: true })
        .limit(limit)
        .skip(skip);
    } else {
      response = await UserModel.find({ status: true }).limit(limit).skip(skip);
    }
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/me", validateToken, async (req, res) => {
  const isAdmin = req.user.isAdmin;
  let response;
  try {
    if (isAdmin) {
      response = await AdminUserModel.findById(req.user.id);
    } else {
      response = await UserModel.findById(req.user.id);
    }
    return res.json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.patch("/:id", async (req, res) => {
  const isAdmin = req.user.isAdmin;
  let response;
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };
    if (isAdmin) {
      if (updatedData?.password != undefined) {
        updatedData.password = await hashPassword(updatedData.password);
      }
      response = await AdminUserModel.findByIdAndUpdate(
        id,
        updatedData,
        options
      );
    } else {
      response = await UserModel.findByIdAndUpdate(id, updatedData, options);
    }
    return res.send(response);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  const isAdmin = req.user.isAdmin;
  let response;
  try {
    if (isAdmin) {
      response = await AdminUserModel.findByIdAndUpdate(
        req.params.id,
        { status: false },
        { new: true }
      );
    } else {
      response = await UserModel.findByIdAndUpdate(
        req.params.id,
        { status: false },
        { new: true }
      );
    }

    return res.send(`${response.username} has been deleted.`);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
