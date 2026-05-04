const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ msg: "User exists" });

  const hashed = await bcrypt.hash(password, 10);
  user = new User({ email, password: hashed });

  await user.save();

  res.json({ msg: "User registered" });
});

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ msg: "Invalid password" });

  const token = jwt.sign({ id: user._id }, "secretkey");

  res.json({ token });
});

module.exports = router;