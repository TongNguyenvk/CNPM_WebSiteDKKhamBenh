const { Booking } = require("../models"); // Import model booking
const { Op } = require("sequelize");

// 🏥 1. Tạo lịch đặt khám mới
exports.createBooking = async (req, res) => {
    try {
        const { statusId, doctorId, patientId, date, timeType } = req.body;

        // Tạo mã token (UUID) cho booking
        const token = require("crypto").randomUUID();

        const newBooking = await Booking.create({
            statusId,
            doctorId,
            patientId,
            date,
            timeType,
            token,
        });

        res.status(201).json({ success: true, data: newBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error });
    }
};

// 🔍 2. Lấy danh sách lịch khám theo bác sĩ
exports.getBookingsByDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;

        const bookings = await Booking.findAll({
            where: { doctorId },
            order: [["date", "ASC"]],
        });

        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error });
    }
};

// 🏥 3. Lấy danh sách lịch khám theo bệnh nhân
exports.getBookingsByPatient = async (req, res) => {
    try {
        const { patientId } = req.params;

        const bookings = await Booking.findAll({
            where: { patientId },
            order: [["date", "ASC"]],
        });

        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error });
    }
};

// ❌ 4. Hủy lịch khám (Bác sĩ hoặc bệnh nhân có thể hủy)
exports.cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findByPk(id);
        if (!booking) {
            return res.status(404).json({ success: false, message: "Không tìm thấy lịch khám" });
        }

        // Cập nhật trạng thái thành "Đã hủy" (mapping với `S2` trong bảng allcode)
        booking.statusId = "S3";
        await booking.save();

        res.status(200).json({ success: true, message: "Hủy lịch thành công", data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error });
    }
};

// 🗑 5. Xóa lịch đã hủy sau 1 tuần
exports.deleteOldCancelledBookings = async (req, res) => {
    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7); // Lấy thời gian cách đây 7 ngày

        const deleted = await Booking.destroy({
            where: {
                statusId: "S2",
                updatedAt: { [Op.lt]: oneWeekAgo },
            },
        });

        res.status(200).json({ success: true, message: `Đã xóa ${deleted} lịch đã hủy quá 1 tuần` });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi server", error });
    }
};
