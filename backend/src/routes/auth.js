const express = require("express");
const router = express.Router();

// TEMP IN-MEMORY USERS
let users = [];

// REGISTER
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields required" });
  }
  const authHeader = req.headers.authorization || "";
const token = authHeader.startsWith("Bearer ")
  ? authHeader.split(" ")[1]
  : null;

  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = {
    id: Date.now(),
    name,
    email,
    password
  };

  users.push(newUser);

  res.json({
    message: "User registered",
    user: { id: newUser.id, name, email }
  });
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const role = user.email === "admin@purehan.com" ? "admin" : "user";

  res.json({
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role
    }
  });
});

module.exports = router;
