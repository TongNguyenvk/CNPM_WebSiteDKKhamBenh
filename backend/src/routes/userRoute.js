// src/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware'); // Import đúng các middleware

// POST /api/users/register - Đăng ký người dùng mới
router.post('/register', userController.registerUser);

// GET /api/users/:id - Lấy thông tin người dùng (yêu cầu xác thực)
router.get('/:id', protect, userController.getUser);

// PUT /api/users/:id - Cập nhật thông tin người dùng (yêu cầu xác thực)
router.put('/:id', protect, userController.updateUser);

// DELETE /api/users/:id - Xóa người dùng (yêu cầu xác thực)
router.delete('/:id', protect, userController.deleteUser);

// Đăng ký bệnh nhân (ai cũng có thể gọi)
router.post('/register-patient', userController.registerPatient);

// Đăng ký bác sĩ (chỉ admin mới được gọi)
router.post('/register-doctor', protect, authorizeRoles("R3"), userController.registerDoctor);

module.exports = router;