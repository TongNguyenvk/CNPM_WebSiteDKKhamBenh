// src/controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Đăng ký người dùng mới
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { email, password, firstName, lastName, gender, phoneNumber, address } = req.body;

        // Kiểm tra xem email đã tồn tại chưa
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        // Tạo người dùng mới
        const user = await User.create({
            email,
            password, // Mật khẩu sẽ được băm bởi hook beforeCreate
            firstName,
            lastName,
            gender,
            phoneNumber,
            address
        });

        // Tạo JWT token (tùy chọn - bạn có thể không tạo token ngay sau khi đăng ký)
        //const token = jwt.sign({ userId: user.id, role: user.roleId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'Đăng ký thành công',
            //token: token,
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.roleId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] } // Không trả về password
        });

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { firstName, lastName, email, password, phoneNumber, address, gender, positionId, roleId, image } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // Cập nhật thông tin người dùng
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        if (password) { // Nếu password được cung cấp, hãy băm nó
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.address = address || user.address;
        user.gender = gender || user.gender;
        user.positionId = positionId || user.positionId;
        user.roleId = roleId || user.roleId;
        user.image = image || user.image;

        await user.save(); // Lưu các thay đổi

        res.json({ message: 'Thông tin người dùng đã được cập nhật thành công', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Xóa người dùng
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        await user.destroy(); // Xóa người dùng

        res.json({ message: 'Người dùng đã được xóa thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = {
    registerUser,
    updateUser,
    deleteUser,
    getUser
};