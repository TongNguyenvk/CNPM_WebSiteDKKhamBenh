// src/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../lib/auth'); // Import hàm generateToken

// @desc    Đăng nhập người dùng
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Tạo JWT token
            const payload = {
                userId: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.roleId
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.json({
                message: 'Đăng nhập thành công',
                token: token,
                userId: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.roleId
            });
        } else {
            res.status(401).json({ message: 'Thông tin đăng nhập không hợp lệ' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = {
    loginUser
};