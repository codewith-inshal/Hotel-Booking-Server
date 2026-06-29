const express = require("express");
const {
  adminLogin,
  adminRegister,
  forgotPassword,
  resetPassword,
} = require("../controllers/admin");

const router = express.Router();

router.post("/admin-register", adminRegister);
router.post("/admin-login", adminLogin);

// ✅ ADD THIS (MISSING)
router.post("/admin-forgot-password", forgotPassword);
router.post("/admin-reset-password/:token", resetPassword);

module.exports = router;
