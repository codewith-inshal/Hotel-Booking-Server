const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, msg: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id, email: user.email, role: 'user' }, process.env.JWT_SECRET);

    res.status(201).json({ success: true, msg: "User registered successfully", user, token });
  } catch (error) {
    res.status(400).json({ success: false, msg: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(401).json({ success: false, msg: "Invalid credentials" });

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return res.status(401).json({ success: false, msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email, role: 'user' }, process.env.JWT_SECRET);

    res.status(200).json({ success: true, msg: "Logged in successfully", user, token });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// FORGOT PASSWORD
const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, msg: "User not found" });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 15 minutes.</p>`
    });

    res.status(200).json({ success: true, msg: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ success: false, msg: "User not found" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ success: true, msg: "Password reset successfully" });
  } catch (error) {
    res.status(400).json({ success: false, msg: "Invalid or expired token" });
  }
};

module.exports = { registerUser, loginUser, forgetPassword, resetPassword };
