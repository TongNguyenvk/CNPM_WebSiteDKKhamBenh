// controllers/scheduleController.js
const db = require('../config/database');
const { Schedule, Allcode } = require('../models');
const { Op } = require('sequelize');



const getDoctorSchedules = async (req, res) => {
    try {
        const doctorId = Number(req.params.doctorId);
        const requestedDate = req.query.date; // Giữ lại biến gốc

        if (isNaN(doctorId)) {
            return res.status(400).json({ message: "doctorId không hợp lệ" });
        }

        let startDate, endDate;

        if (requestedDate) {
            // --- Trường hợp CÓ date query param ---
            // Chỉ lấy đúng ngày được yêu cầu
            // Validate date format if needed
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(requestedDate)) {
                return res.status(400).json({ message: "Định dạng ngày không hợp lệ. Vui lòng sử dụng YYYY-MM-DD." });
            }
            startDate = new Date(requestedDate);
            if (isNaN(startDate.getTime())) {
                return res.status(400).json({ message: "Giá trị ngày không hợp lệ." });
            }
            endDate = new Date(requestedDate); // endDate giống startDate

        } else {
            // --- Trường hợp KHÔNG CÓ date query param ---
            // Lấy ngày hôm nay + 3 ngày tới
            const today = new Date();
            // Đặt về 0 giờ để tránh lỗi múi giờ khi tính toán
            today.setHours(0, 0, 0, 0);
            startDate = new Date(today);
            endDate = new Date(today);
            endDate.setDate(today.getDate() + 3);
        }

        const startQueryDate = startDate.toISOString().split('T')[0];
        const endQueryDate = endDate.toISOString().split('T')[0];

        console.log(`Querying schedules for doctor ${doctorId} between ${startQueryDate} and ${endQueryDate}`);

        const schedules = await Schedule.findAll({
            where: {
                doctorId,
                date: {
                    // Op.between vẫn hoạt động khi start = end (lấy đúng 1 ngày)
                    [Op.between]: [startQueryDate, endQueryDate]
                }
            },
            include: [
                {
                    model: Allcode,
                    as: 'timeTypeData',
                    attributes: ['valueVi', 'valueEn']
                }
            ],
            order: [['date', 'ASC'], ['timeType', 'ASC']],
            raw: false,
            nest: true
        });

        return res.json(schedules);
    } catch (error) {
        console.error("Error in getDoctorSchedules:", error);
        return res.status(500).json({ message: "Lỗi server", error: error.message });
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