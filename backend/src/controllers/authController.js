// src/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../lib/auth'); // Import hàm generateToken

// @desc    Đăng nhập người dùng
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Kiểm tra đầu vào
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Vui lòng nhập email và mật khẩu',
                field: !email ? 'email' : 'password'
            });
        }

        // Tìm user theo email
        const user = await User.findOne({ where: { email } });

        // Kiểm tra xem email có tồn tại không
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Email không tồn tại trong hệ thống',
                field: 'email'
            });
        }

        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: 'Mật khẩu không chính xác',
                field: 'password'
            });
        }

        // Đăng nhập thành công - Tạo JWT token
        const payload = {
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.roleId
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            success: true,
            message: 'Đăng nhập thành công',
            token: token,
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.roleId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: 'Lỗi server', 
            error: error.message 
        });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.userId;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

module.exports = {
    loginUser,
    getCurrentUser
};