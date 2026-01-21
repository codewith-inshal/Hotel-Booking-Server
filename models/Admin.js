const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please fill First name"],
    minlength: [3, "First name should be at least of 3 characters"],
    maxlength: [18, "First name should be at most 18 characters"]
  },
  lastName: {
    type: String,
    required: [true, "Please fill Last name"],
    minlength: [3, "Last name should be at least of 3 characters"],
    maxlength: [18, "Last name should be at most 18 characters"]
  },
  email: {
    type: String,
    required: [true, "Please fill email"],
    unique: [true, "Email already exists"]
  },
  password: {
    type: String,
    required: [true, "Please fill Password field"],
    minlength: [8, "Password should be at least 8 characters"]
  }
}, { timestamps: true });

module.exports = mongoose.model('Admin', adminSchema);
