// src/controllers/specialtyController.js
const Specialty = require('../models/Specialty');

// @desc    Lấy tất cả các specialties
// @route   GET /api/specialties
// @access  Public
const getAllSpecialties = async (req, res) => {
    try {
        const specialties = await Specialty.findAll();
        res.json(specialties);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Lấy thông tin một specialty theo ID
// @route   GET /api/specialties/:id
// @access  Public
const getSpecialtyById = async (req, res) => {
    try {
        const specialtyId = req.params.id;
        const specialty = await Specialty.findByPk(specialtyId);

        if (!specialty) {
            return res.status(404).json({ message: 'Không tìm thấy chuyên khoa' });
        }

        res.json(specialty);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Tạo một specialty mới
// @route   POST /api/specialties
// @access  Public
const createSpecialty = async (req, res) => {
    try {
        const { description, image, name } = req.body;

        const specialty = await Specialty.create({
            description,
            image,
            name
        });

        res.status(201).json({ message: 'Chuyên khoa đã được tạo thành công', specialty });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Cập nhật thông tin một specialty
// @route   PUT /api/specialties/:id
// @access  Public
const updateSpecialty = async (req, res) => {
    try {
        const specialtyId = req.params.id;
        const { description, image, name } = req.body;

        const specialty = await Specialty.findByPk(specialtyId);

        if (!specialty) {
            return res.status(404).json({ message: 'Không tìm thấy chuyên khoa' });
        }

        specialty.description = description || specialty.description;
        specialty.image = image || specialty.image;
        specialty.name = name || specialty.name;

        await specialty.save();

        res.json({ message: 'Thông tin chuyên khoa đã được cập nhật thành công', specialty });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// @desc    Xóa một specialty
// @route   DELETE /api/specialties/:id
// @access  Public
const deleteSpecialty = async (req, res) => {
    try {
        const specialtyId = req.params.id;

        const specialty = await Specialty.findByPk(specialtyId);

        if (!specialty) {
            return res.status(404).json({ message: 'Không tìm thấy chuyên khoa' });
        }

        await specialty.destroy();

        res.json({ message: 'Chuyên khoa đã được xóa thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

module.exports = {
    getAllSpecialties,
    getSpecialtyById,
    createSpecialty,
    updateSpecialty,
    deleteSpecialty
};