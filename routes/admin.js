const express = require('express')
const { adminLogin, adminRegister } = require('../controllers/admin')
const router = express.Router()

router.post('/admin-register', adminRegister)
router.post('/admin-login', adminLogin)

module.exports = router