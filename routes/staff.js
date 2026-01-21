const express = require('express');
const { staffLogin, staffRegister, staffDelete, forgotPassword, resetPassword } = require('../controllers/staff');
const router = express.Router();

router.post('/staff-register', staffRegister);
router.post('/staff-login', staffLogin);
router.delete("/:id", staffDelete);
router.post('/staff-forgot-password', forgotPassword);
router.post('/staff-reset-password/:token', resetPassword);

module.exports = router;
