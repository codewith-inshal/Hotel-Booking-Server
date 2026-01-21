const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  forgetPassword
} = require('../controllers/user');

// AUTH
router.post('/user-register', registerUser);
router.post('/user-login', loginUser);

// PASSWORD RESET
router.post('/forget-password', forgetPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;
