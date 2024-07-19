const express = require("express");

const AdminUserModel = require("../models/admin_users");
const UserModel = require("../models/users");
const { generateToken, comparePassword } = require("../utils");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const response = await AdminUserModel.find({ status: true, email });
  if (response.length == 0)
    return res.send({
      message: "Not registered",
    });
  let { password: hashed_password, username } = response[0] || {};
  if (comparePassword(password, hashed_password)) {
    return res.json({ token: generateToken({ username, email }) });
  } else {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }
});

router.get("/isAdmin", async (req, res) => {
  const email = req.query.email;
  if (email == undefined) {
    res.status(400).send({ message: "Email missing" });
  }
  let response;
  try {
    response = await AdminUserModel.find({ status: true, email });
    if (response.length != 0)
      return res.status(200).send({
        isAdmin: true,
        token: generateToken({
          username: response[0].username,
          email,
          id: response[0]._id,
          isAdmin: true,
        }),
      });

    response = await UserModel.find({ status: true, email });

    if (response.length == 0) return Error("Not registered");
    return res.status(200).send({
      token: generateToken({
        username: response[0].username,
        email,
        id: response[0]._id,
        isAdmin: false,
      }),
      isAdmin: false,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
