const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SECRET_KEY = "SECRET_KEY";
const EXPIRE_TIME_SEC = 60 * 60 * 24;

const generateToken = (payload) =>
  jwt.sign(payload, SECRET_KEY, {
    expiresIn: EXPIRE_TIME_SEC,
  });

const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split("Bearer ")[1];

    jwt.verify(token, SECRET_KEY, (err, payload) => {
      if (err) {
        return res.status(403).json({
          message: "Token not Valid",
        });
      } else {
        req.user = payload;
        next();
      }
    });
  } else {
    return res.status(401).json({
      message: "Token not found.",
    });
  }
};

const getRandomKey = (size = 16) =>
  [...Array(size)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");

const hashPassword = async (password) =>
  await bcrypt.hash(password.toString(), 10);

const comparePassword = async (password, hashed_password) =>
  await bcrypt.compare(password.toString(), hashed_password);

module.exports = {
  generateToken,
  validateToken,
  getRandomKey,
  hashPassword,
  comparePassword,
};
