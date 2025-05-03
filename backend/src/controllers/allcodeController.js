const { Allcode } = require('../models');

// Lấy tất cả các mã theo type
const getAllCodesByType = async (req, res) => {
    try {
        const { type } = req.query;
        if (!type) {
            return res.status(400).json({
                message: 'Thiếu thông tin type'
            });
        }

        const allcodes = await Allcode.findAll({
            where: { type },
            attributes: ['keyMap', 'type', 'valueVi', 'valueEn'],
            order: [['keyMap', 'ASC']]
        });

        return res.status(200).json({
            message: 'Lấy danh sách mã thành công',
            data: allcodes
        });
    } catch (error) {
        console.error('Error in getAllCodesByType:', error);
        return res.status(500).json({
            message: 'Lỗi server',
            error: error.message
        });
    }
};

// Lấy tất cả các loại mã
const getAllTypes = async (req, res) => {
    try {
        const types = await Allcode.findAll({
            attributes: ['type'],
            group: ['type'],
            order: [['type', 'ASC']]
        });

        return res.status(200).json({
            message: 'Lấy danh sách loại mã thành công',
            data: types.map(type => type.type)
        });
    } catch (error) {
        console.error('Error in getAllTypes:', error);
        return res.status(500).json({
            message: 'Lỗi server',
            error: error.message
        });
    }
};

// Lấy thông tin một mã cụ thể
const getCodeByKey = async (req, res) => {
    try {
        const { keyMap } = req.params;
        const code = await Allcode.findOne({
            where: { keyMap },
            attributes: ['keyMap', 'type', 'valueVi', 'valueEn']
        });

        if (!code) {
            return res.status(404).json({
                message: 'Không tìm thấy mã'
            });
        }

        return res.status(200).json({
            message: 'Lấy thông tin mã thành công',
            data: code
        });
    } catch (error) {
        console.error('Error in getCodeByKey:', error);
        return res.status(500).json({
            message: 'Lỗi server',
            error: error.message
        });
    }
};

// Tạo mã mới
const createCode = async (req, res) => {
    try {
        const { keyMap, type, valueVi, valueEn } = req.body;

        // Kiểm tra các trường bắt buộc
        if (!keyMap || !type || !valueVi || !valueEn) {
            return res.status(400).json({
                message: 'Thiếu thông tin bắt buộc'
            });
        }

        // Kiểm tra mã đã tồn tại chưa
        const existingCode = await Allcode.findOne({
            where: { keyMap }
        });

        if (existingCode) {
            return res.status(400).json({
                message: 'Mã đã tồn tại'
            });
        }

        const newCode = await Allcode.create({
            keyMap,
            type,
            valueVi,
            valueEn
        });

        return res.status(201).json({
            message: 'Tạo mã thành công',
            data: newCode
        });
    } catch (error) {
        console.error('Error in createCode:', error);
        return res.status(500).json({
            message: 'Lỗi server',
            error: error.message
        });
    }
};

// Cập nhật mã
const updateCode = async (req, res) => {
    try {
        const { keyMap } = req.params;
        const { valueVi, valueEn } = req.body;

        const code = await Allcode.findOne({
            where: { keyMap }
        });

        if (!code) {
            return res.status(404).json({
                message: 'Không tìm thấy mã'
            });
        }

        // Cập nhật thông tin
        if (valueVi) code.valueVi = valueVi;
        if (valueEn) code.valueEn = valueEn;

        await code.save();

        return res.status(200).json({
            message: 'Cập nhật mã thành công',
            data: code
        });
    } catch (error) {
        console.error('Error in updateCode:', error);
        return res.status(500).json({
            message: 'Lỗi server',
            error: error.message
        });
    }
};

// Xóa mã
const deleteCode = async (req, res) => {
    try {
        const { keyMap } = req.params;

        const code = await Allcode.findOne({
            where: { keyMap }
        });

        if (!code) {
            return res.status(404).json({
                message: 'Không tìm thấy mã'
            });
        }

        await code.destroy();

        return res.status(200).json({
            message: 'Xóa mã thành công'
        });
    } catch (error) {
        console.error('Error in deleteCode:', error);
        return res.status(500).json({
            message: 'Lỗi server',
            error: error.message
        });
    }
};

module.exports = {
    getAllCodesByType,
    getAllTypes,
    getCodeByKey,
    createCode,
    updateCode,
    deleteCode
}; 