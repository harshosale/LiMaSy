const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const users = require("./endpoints/users");
const books = require("./endpoints/books");
const transactions = require("./endpoints/transactions");
const auths = require("./endpoints/auth");

const bodyParser = require("body-parser");

mongoose.connect(process.env.DATABASE_URL);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("Database Connected");
});

const app = express();
const PORT = 3000;
const corsOptions = {
  origin: "http://localhost:3001",
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cors(corsOptions));
app.use("/", auths);
app.use("/users", users);
app.use("/books", books);
app.use("/transactions", transactions);

app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Server Started at http://localhost:${3000}`);
});

app.get("/", (req, res) => {
  return res.send("App has started");
});
