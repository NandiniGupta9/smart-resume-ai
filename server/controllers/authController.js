const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "This email is already registered." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: "Account created successfully. Please log in." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Signup failed. Please try again." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    const isMatch = user ? await bcrypt.compare(password, user.password) : false;

    if (!user || !isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed. Please try again." });
  }
};
