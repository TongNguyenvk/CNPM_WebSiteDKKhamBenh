// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware//authMiddleware')

// POST /api/auth/login - Đăng nhập
router.post('/login', authController.loginUser);

module.exports = router;
