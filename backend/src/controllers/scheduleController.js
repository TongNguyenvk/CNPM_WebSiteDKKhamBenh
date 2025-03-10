// controllers/scheduleController.js
const db = require('../config/database');
const { Schedule, Allcode } = require('../models');
const getDoctorSchedules = async (req, res) => {
    try {
        const { doctorId } = req.params;
        let { date } = req.query;

        // Nếu không có date, mặc định lấy ngày hiện tại
        const today = new Date();
        if (!date) {
            date = today.toISOString().split('T')[0]; // YYYY-MM-DD
        }

        // Chuyển đổi ngày bắt đầu thành dạng Date
        const startDate = new Date(date);

        // Lấy 3 ngày kế tiếp
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 3);

        const whereClause = {
            doctorId: doctorId,
            date: {
                [Op.between]: [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]
            }
        };

        const schedules = await Schedule.findAll({
            where: whereClause,
            include: [
                { model: Allcode, as: 'timeTypeData', attributes: ['valueVi', 'valueEn'] }
            ],
            raw: false,
            nest: true,
            order: [['date', 'ASC'], ['timeType', 'ASC']] // Sắp xếp theo ngày và giờ
        });

        res.json(schedules);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};


const getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.findAll({
            include: [
                { model: Allcode, as: 'timeTypeData', attributes: ['valueVi', 'valueEn'] }
            ],
            order: [['date', 'ASC'], ['timeType', 'ASC']]
        });
        res.status(200).json(schedules);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Lấy một schedule theo id
const getScheduleById = async (req, res) => {
    try {
        const { id } = req.params;
        const schedule = await Schedule.findByPk(id, {
            include: [
                { model: Allcode, as: 'timeTypeData', attributes: ['valueVi', 'valueEn'] }
            ]
        });
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule không tồn tại' });
        }
        res.status(200).json(schedule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Tạo mới một schedule
const createSchedule = async (req, res) => {
    try {
        const { doctorId, date, timeType, maxNumber } = req.body;
        // Có thể thêm kiểm tra dữ liệu đầu vào tại đây

        const newSchedule = await Schedule.create({
            doctorId,
            date,
            timeType,
            maxNumber
        });
        res.status(201).json(newSchedule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Cập nhật một schedule theo id
const updateSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const { doctorId, date, timeType, maxNumber } = req.body;

        const schedule = await Schedule.findByPk(id);
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule không tồn tại' });
        }

        schedule.doctorId = doctorId !== undefined ? doctorId : schedule.doctorId;
        schedule.date = date !== undefined ? date : schedule.date;
        schedule.timeType = timeType !== undefined ? timeType : schedule.timeType;
        schedule.maxNumber = maxNumber !== undefined ? maxNumber : schedule.maxNumber;

        await schedule.save();
        res.status(200).json(schedule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Xoá một schedule theo id
const deleteSchedule = async (req, res) => {
    try {
        const { id } = req.params;
        const schedule = await Schedule.findByPk(id);
        if (!schedule) {
            return res.status(404).json({ message: 'Schedule không tồn tại' });
        }
        await schedule.destroy();
        res.status(200).json({ message: 'Xoá schedule thành công' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

const getDoctorSchedule = async (req, res) => {
    try {
        const doctorId = req.params.doctorId;
        const today = new Date();
        const threeDaysLater = new Date();
        threeDaysLater.setDate(today.getDate() + 3); // Ngày sau 3 ngày

        const schedules = await Schedule.findAll({
            where: {
                doctorId: doctorId,
                date: {
                    [Op.between]: [today, threeDaysLater], // Lấy lịch khám trong 3 ngày tới
                },
            },
            order: [["date", "ASC"], ["time", "ASC"]], // Sắp xếp theo ngày & thời gian
        });

        return res.status(200).json(schedules);
    } catch (error) {
        console.error("Lỗi lấy lịch khám:", error);
        return res.status(500).json({ message: "Lỗi server" });
    }
};
module.exports = {
    getDoctorSchedules,
    deleteSchedule,
    createSchedule,
    updateSchedule,
    getAllSchedules,
    getScheduleById
};