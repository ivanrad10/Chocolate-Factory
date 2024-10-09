//require('dotenv').config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const authenticateToken = require("./authMiddleware.js");
const bcrypt = require("bcrypt");

const UserRepository = require("../Repository/UserRepository.js");
const userRepository = new UserRepository();
const User = require("../Model/User.js");

const SECRET_KEY =
  "a30b0e3a1fd57f407f61884e99ce60612b248a8aa3c5a015452e5b79c06fadbf6a3666d7396c3d33dac7bf766ab8f64c28579eb023ac7b9904fd8f4f27fa948b";

router.get("/", (req, res) => {
  const users = userRepository.getAll();
  return res.json(users);
});

router.get("/:username", (req, res) => {
  const username = req.params.username;
  const user = userRepository.getByUsername(username);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json(user);
});

//provera da li username vec postoji
router.get("/check/:username", (req, res) => {
  const username = req.params.username;
  const user = userRepository.getByUsername(username);

  if (user) {
    return res.status(409).json({ error: "User already exists" });
  }
  return res.status(200).json({ message: "Username is available" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = userRepository.getByUsername(username);
  if (!user) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  const token = jwt.sign(
    { username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  //res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });

  res.json({ message: "Login successful", token, role: user.role });
});

//primer poziva zasticene stranice, samo ako ima token (ako je logovan) dobice uvid u stranicu
//dok se uloga proverava na frontu
router.get("/cart", authenticateToken, (req, res) => {
  const user = userRepository.getByUsername(req.user.username);
  if (user) {
    res.json(user.cart);
  } else {
    res.sendStatus(404);
  }
});

//koristi se na javnim stranicama za proveravanje logina/tokena
router.post("/verifyToken", (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    res.json({ username: user.username, role: user.role });
  });
});

router.post("/", async (req, res) => {
  const {
    username,
    password,
    name,
    lastname,
    gender,
    birthDate,
    role,
    purchases,
    cart,
    factory,
    points,
    customerType,
  } = req.body;

  const existingUser = userRepository.getByUsername(username);
  if (existingUser) {
    return res.status(409).json({ error: "User already exists" });
  }

  const hashedPassword = await hashPassword(password);

  const newUser = new User(
    null,
    username,
    hashedPassword,
    name,
    lastname,
    gender,
    birthDate,
    role,
    purchases,
    cart,
    factory,
    points,
    customerType
  );

  const addedUser = userRepository.add(newUser);
  return res.json({
    message: "User registered successfully",
    user: addedUser,
  });
});

router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const updatedData = { id, ...req.body };
  const updatedUser = userRepository.update(updatedData);
  if (!updatedUser) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json({
    message: "User updated successfully",
    user: updatedUser,
  });
});

router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const deletedUser = userRepository.delete(id);
  if (!deletedUser) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json({
    message: "User deleted successfully",
    user: deletedUser,
  });
});

async function hashPassword(plainPassword) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashedPassword;
}

async function verifyPassword(plainPassword, hashedPassword) {
  const match = await bcrypt.compare(plainPassword, hashedPassword);
  return match;
}

module.exports = router;
