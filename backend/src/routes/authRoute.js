// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/verifyToken')

// POST /api/auth/login - Đăng nhập
router.post('/login', authController.loginUser);
router.get('/me', verifyToken, authController.getCurrentUser);
module.exports = router;
