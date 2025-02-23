// controllers/doctorController.js
const db = require('../config/database');
const User = require('../models/User');
const DoctorDetail = require('../models/DoctorDetail');
const { Op } = require("sequelize");

const createDoctor = async (req, res) => {
    try {
        const { firstName, lastName, email, password, address, gender, phoneNumber, positionId, image, descriptionMarkdown, descriptionHTML, specialtyId } = req.body;

        // Tạo user mới (với vai trò là bác sĩ)
        const user = await User.create({
            firstName,
            lastName,
            email,
            password, // Mật khẩu sẽ được băm bởi hook beforeCreate
            address,
            gender,
            roleId: 'R2', // Bác sĩ
            phoneNumber,
            positionId,
            image,
            specialtyId
        });

        // Tạo thông tin chi tiết bác sĩ
        await DoctorDetail.create({
            doctorId: user.id,
            descriptionMarkdown,
            descriptionHTML
        });

        res.status(201).json({ message: 'Tạo bác sĩ thành công', doctor: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const getDoctor = async (req, res) => {
    try {
        const { id } = req.params;

        const doctor = await User.findByPk(id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: DoctorDetail,
                    as: 'doctorDetail', // Alias để truy cập thông tin DoctorDetail
                    attributes: ['descriptionMarkdown', 'descriptionHTML']
                }
            ]
        });

        if (!doctor) {
            return res.status(404).json({ message: 'Không tìm thấy bác sĩ' });
        }

        res.json(doctor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, password, address, gender, phoneNumber, positionId, image, descriptionMarkdown, descriptionHTML, specialtyId } = req.body;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy bác sĩ' });
        }

        // Cập nhật thông tin user
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        if (password) {
            // Băm mật khẩu (nếu được cung cấp)
        }
        user.address = address || user.address;
        user.gender = gender || user.gender;
        user.phoneNumber = phoneNumber || user.phoneNumber;
        user.positionId = positionId || user.positionId;
        user.image = image || user.image;
        user.specialtyId = specialtyId || user.specialtyId

        await user.save();

        // Cập nhật thông tin chi tiết bác sĩ
        const doctorDetail = await DoctorDetail.findOne({ where: { doctorId: id } });

        if (doctorDetail) {
            doctorDetail.descriptionMarkdown = descriptionMarkdown || doctorDetail.descriptionMarkdown;
            doctorDetail.descriptionHTML = descriptionHTML || doctorDetail.descriptionHTML;
            await doctorDetail.save();
        } else {
            await DoctorDetail.create({
                doctorId: user.id,
                descriptionMarkdown,
                descriptionHTML
            });
        }
        res.json({ message: 'Thông tin bác sĩ đã được cập nhật thành công', doctor: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy bác sĩ' });
        }

        await DoctorDetail.destroy({ where: { doctorId: id } });
        await user.destroy();

        res.json({ message: 'Bác sĩ đã được xóa thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// controllers/doctorController.js


const getAllDoctors = async (req, res) => {
    try {
        const doctors = await User.findAll({
            where: {
                roleId: 'R2' // Lấy tất cả users có role là bác sĩ (R2)
            },
            attributes: { exclude: ['password'] }, // Loại bỏ password khỏi kết quả
            include: [
                {
                    model: DoctorDetail,
                    as: 'doctorDetail', // Alias để truy cập thông tin DoctorDetail
                    attributes: ['descriptionMarkdown', 'descriptionHTML'] // Chọn các thuộc tính cần thiết
                }
            ],
            //raw: true,  // Loại bỏ raw: true và nest: true
            //nest: true, // Sử dụng eager loading thay vì raw: true và nest: true
        });

        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const getDoctorsBySpecialty = async (req, res) => {
    try {
        const { specialtyId } = req.params;

        const doctors = await User.findAll({
            where: {
                roleId: 'R2', // Lấy tất cả users có role là bác sĩ (R2)
                specialtyId: specialtyId  // Thêm điều kiện lọc theo chuyên khoa
            },
            attributes: { exclude: ['password'] }, // Loại bỏ password khỏi kết quả
            include: [
                {
                    model: DoctorDetail,
                    as: 'doctorDetail', // Alias để truy cập thông tin DoctorDetail
                    attributes: ['descriptionMarkdown', 'descriptionHTML']
                } // Lấy thông tin chi tiết bác sĩ
            ],
            raw: false,
            nest: true
        });

        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = {
    createDoctor,
    getDoctor,
    updateDoctor,
    deleteDoctor,
    getAllDoctors,
    getDoctorsBySpecialty
};