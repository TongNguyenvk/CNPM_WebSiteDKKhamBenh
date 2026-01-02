// src/controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize } = require('../models/User');
const DoctorDetail = require('../models/DoctorDetail');
const path = require('path');
const fs = require('fs');

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
        const db = require('../models');

        const user = await User.findByPk(userId, {
            attributes: { exclude: ['password'] }, // Không trả về password
            include: [
                {
                    model: db.Specialty,
                    as: 'specialtyData',
                    attributes: ['id', 'name']
                },
                {
                    model: db.Allcode,
                    as: 'positionData',
                    attributes: ['keyMap', 'valueVi', 'valueEn']
                }
            ]
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
        user.specialtyId = req.body.specialtyId || user.specialtyId;

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

// Đăng ký bệnh nhân (ai cũng có thể gọi)
const registerPatient = async (req, res) => {
    try {
        const { email, password, firstName, lastName, gender, phoneNumber, address } = req.body;

        // Kiểm tra email đã tồn tại chưa
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        // Tạo user với roleId = "R1" (Patient)
        const user = await User.create({
            email,
            password,
            firstName,
            lastName,
            gender,
            phoneNumber,
            address,
            roleId: "R1"
        });

        res.status(201).json({
            message: 'Đăng ký bệnh nhân thành công',
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

// Đăng ký bác sĩ với thông tin chi tiết (chỉ admin mới được gọi)
const registerDoctor = async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (!req.user || req.user.roleId !== "R3") {
            return res.status(403).json({ message: 'Chỉ admin mới có quyền tạo bác sĩ' });
        }

        const {
            email,
            password,
            firstName,
            lastName,
            gender,
            phoneNumber,
            address,
            positionId,
            image,
            specialtyId,
            descriptionMarkdown,
            descriptionHTML
        } = req.body;

        // Kiểm tra email đã tồn tại chưa
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        // Bắt đầu transaction để đảm bảo tính toàn vẹn dữ liệu
        const result = await sequelize.transaction(async (t) => {
            // Tạo user với roleId = "R2" (Doctor)
            const user = await User.create({
                email,
                password,
                firstName,
                lastName,
                gender,
                phoneNumber,
                address,
                roleId: "R2",
                positionId: positionId || "P1", // Mặc định là P1 nếu không có
                image,
                specialtyId
            }, { transaction: t });

            // Tạo thông tin chi tiết cho bác sĩ
            if (descriptionMarkdown || descriptionHTML) {
                await DoctorDetail.create({
                    doctorId: user.id,
                    descriptionMarkdown: descriptionMarkdown || '',
                    descriptionHTML: descriptionHTML || ''
                }, { transaction: t });
            }

            return user;
        });

        res.status(201).json({
            message: 'Đăng ký bác sĩ thành công',
            userId: result.id,
            email: result.email,
            firstName: result.firstName,
            lastName: result.lastName,
            role: result.roleId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Đăng ký admin mới (chỉ admin hiện tại mới được gọi)
const registerAdmin = async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (!req.user || req.user.roleId !== "R3") {
            return res.status(403).json({ message: 'Chỉ admin mới có quyền tạo admin khác' });
        }

        const {
            email,
            password,
            firstName,
            lastName,
            gender,
            phoneNumber,
            address,
            image
        } = req.body;

        // Kiểm tra email đã tồn tại chưa
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: 'Email đã được sử dụng' });
        }

        // Tạo user với roleId = "R3" (Admin)
        const user = await User.create({
            email,
            password,
            firstName,
            lastName,
            gender,
            phoneNumber,
            address,
            roleId: "R3",
            positionId: null, // Admin không có position
            image
        });

        res.status(201).json({
            message: 'Đăng ký admin thành công',
            userId: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.roleId
        });
    } catch (error) {
        console.error(error);
        // Handle Sequelize validation errors
        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(e => e.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({ message: 'Dữ liệu không hợp lệ (foreign key constraint)' });
        }
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Lấy tất cả user và phân loại theo quyền
// @route   GET /api/users/all
// @access  Private (Admin)
const getAllUsersByRole = async (req, res) => {
    try {
        // Kiểm tra quyền admin
        if (!req.user || req.user.roleId !== "R3") {
            return res.status(403).json({ message: 'Chỉ admin mới có quyền xem danh sách người dùng' });
        }

        const users = await User.findAll({
            attributes: { exclude: ['password'] }, // Không trả về password
            include: [
                {
                    model: User.sequelize.models.Allcode,
                    as: 'roleData',
                    attributes: ['keyMap', 'valueVi', 'valueEn']
                },
                {
                    model: User.sequelize.models.Allcode,
                    as: 'positionData',
                    attributes: ['keyMap', 'valueVi', 'valueEn']
                },
                {
                    model: User.sequelize.models.Specialty,
                    as: 'specialtyData',
                    attributes: ['id', 'name']
                }
            ]
        });

        // Phân loại user theo roleId
        const groupedUsers = {
            R1: [], // Bệnh nhân
            R2: [], // Bác sĩ
            R3: []  // Admin
        };

        users.forEach(user => {
            const userData = user.get({ plain: true });
            if (groupedUsers[user.roleId]) {
                groupedUsers[user.roleId].push(userData);
            }
        });

        res.json({
            success: true,
            data: groupedUsers,
            message: 'Lấy danh sách người dùng thành công'
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

// Upload avatar/profile image
const uploadProfileImage = async (req, res) => {
    try {
        console.log('--- [UPLOAD PROFILE IMAGE] ---');
        console.log('req.user:', req.user);
        console.log('req.file:', req.file);
        if (!req.user) {
            console.log('Không xác thực');
            return res.status(401).json({ message: 'Không xác thực' });
        }
        if (!req.file) {
            console.log('Không có file ảnh');
            return res.status(400).json({ message: 'Không có file ảnh' });
        }
        // Đường dẫn lưu file
        const imageUrl = `/uploads/avatars/${req.file.filename}`;
        req.user.image = imageUrl;
        await req.user.save();
        console.log('Lưu ảnh thành công:', imageUrl);
        res.json({ imageUrl });
    } catch (error) {
        console.error('Lỗi upload ảnh:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = {
    registerUser,
    registerPatient,
    registerDoctor,
    registerAdmin,
    updateUser,
    deleteUser,
    getUser,
    getAllUsersByRole,
    uploadProfileImage
};