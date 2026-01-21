const adminModel = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const adminRegister = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const existingadmin = await adminModel.findOne({ email });
  if (existingadmin) return res.status(400).json({ success:false, msg:"Email already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const admin = await adminModel.create({ firstName, lastName, email, password: hashedPassword });

  const token = jwt.sign({ id: admin._id, email: admin.email, role: 'admin' }, process.env.JWT_SECRET);
  res.status(201).json({ success:true, msg:"Admin registered successfully", admin, token });
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const admin = await adminModel.findOne({ email });
  if (!admin) return res.status(404).json({ success:false, msg:"Admin doesn't exist" });

  const matched = await bcrypt.compare(password, admin.password);
  if (!matched) return res.status(400).json({ success:false, msg:"Invalid Credentials" });

  const token = jwt.sign({ id: admin._id, email: admin.email, role: 'admin' }, process.env.JWT_SECRET);
  res.status(200).json({ success:true, msg:"Admin logged in successfully", token });
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const admin = await adminModel.findOne({ email });
  if (!admin) return res.status(404).json({ success:false, msg:"Admin not found" });

  const resetToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  const resetUrl = `${process.env.CLIENT_URL}/admin-reset-password/${resetToken}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: admin.email,
    subject: "Admin Password Reset",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 15 minutes.</p>`
  });

  res.status(200).json({ success:true, msg:"Password reset email sent" });
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await adminModel.findById(decoded.id);
    if (!admin) return res.status(404).json({ success:false, msg:"Admin not found" });

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.status(200).json({ success:true, msg:"Password reset successfully" });
  } catch (err) {
    res.status(400).json({ success:false, msg:"Invalid or expired token" });
  }
};

module.exports = { adminRegister, adminLogin, forgotPassword, resetPassword };
