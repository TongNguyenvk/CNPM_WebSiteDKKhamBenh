// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Import middleware xác thực

// POST /api/users/register - Đăng ký người dùng mới
router.post('/register', userController.registerUser);

// GET /api/users/:id - Lấy thông tin người dùng (yêu cầu xác thực)
router.get('/:id',  userController.getUser); // Áp dụng middleware

// PUT /api/users/:id - Cập nhật thông tin người dùng (yêu cầu xác thực)
router.put('/:id',  userController.updateUser); // Áp dụng middleware

// DELETE /api/users/:id - Xóa người dùng (yêu cầu xác thực)
router.delete('/:id',  userController.deleteUser); // Áp dụng middleware

module.exports = router;