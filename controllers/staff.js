const staffModel = require('../models/Staff');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const staffRegister = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const existingstaff = await staffModel.findOne({ email });
  if (existingstaff) return res.status(400).json({ success:false, msg:"Email already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const staff = await staffModel.create({ firstName, lastName, email, password: hashedPassword });

  const token = jwt.sign({ id: staff._id, email: staff.email, role: 'staff' }, process.env.JWT_SECRET);
  res.status(201).json({ success:true, msg:"Staff registered successfully", staff, token });
};

const staffLogin = async (req, res) => {
  const { email, password } = req.body;
  const staff = await staffModel.findOne({ email });
  if (!staff) return res.status(404).json({ success:false, msg:"Staff not found" });

  const matched = await bcrypt.compare(password, staff.password);
  if (!matched) return res.status(400).json({ success:false, msg:"Invalid credentials" });

  const token = jwt.sign({ id: staff._id, email: staff.email, role: 'staff' }, process.env.JWT_SECRET);
  res.status(200).json({ success:true, msg:"Staff logged in successfully", token });
};

// Delete staff member
const staffDelete = async (req, res) => {
  const id = req.params.id;
  await staffModel.findByIdAndDelete(id);
  res.status(200).json({ message: "Staff deleted successfully" });
};

// Forgot password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const staff = await staffModel.findOne({ email });
  if (!staff) return res.status(404).json({ success:false, msg:"Staff not found" });

  const resetToken = jwt.sign({ id: staff._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  const resetUrl = `${process.env.CLIENT_URL}/staff-reset-password/${resetToken}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: staff.email,
    subject: "Staff Password Reset",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 15 minutes.</p>`
  });

  res.status(200).json({ success:true, msg:"Password reset email sent" });
};

// Reset password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const staff = await staffModel.findById(decoded.id);
    if (!staff) return res.status(404).json({ success:false, msg:"Staff not found" });

    staff.password = await bcrypt.hash(newPassword, 10);
    await staff.save();

    res.status(200).json({ success:true, msg:"Password reset successfully" });
  } catch (err) {
    res.status(400).json({ success:false, msg:"Invalid or expired token" });
  }
};

module.exports = { staffRegister, staffLogin, staffDelete, forgotPassword, resetPassword };
