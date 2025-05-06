const db = require("../models"); // Import toàn bộ models
//const { Booking } = db;
const { Op } = require("sequelize");

// 🏥 1. Tạo lịch đặt khám mới
exports.createBooking = async (req, res) => {
    try {
        const { statusId, doctorId, patientId, date, timeType } = req.body;

        // Tạo mã token (UUID) cho booking
        const token = require("crypto").randomUUID();

        const newBooking = await db.Booking.create({
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

        const bookings = await db.Booking.findAll({
            where: { doctorId },
            include: [
                {
                    model: db.User,
                    as: 'doctorData',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'address', 'gender', 'phoneNumber', 'image'],
                    include: [
                        {
                            model: db.DoctorDetail,
                            as: 'doctorDetail',
                            attributes: ['descriptionMarkdown', 'descriptionHTML']
                        },
                        {
                            model: db.Specialty,
                            attributes: ['id', 'name', 'image', 'description']
                        },
                        {
                            model: db.Allcode,
                            as: 'roleData',
                            attributes: ['keyMap', 'valueVi', 'valueEn']
                        },
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['keyMap', 'valueVi', 'valueEn']
                        }
                    ]
                },
                {
                    model: db.User,
                    as: 'patientData',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'address', 'gender', 'phoneNumber', 'image']
                },
                {
                    model: db.Allcode,
                    as: 'statusData',
                    attributes: ['keyMap', 'valueVi', 'valueEn']
                },
                {
                    model: db.Allcode,
                    as: 'timeTypeData',
                    attributes: ['keyMap', 'valueVi', 'valueEn']
                }
            ],
            order: [["date", "ASC"]],
        });

        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        console.error('Error in getBookingsByDoctor:', error);
        res.status(500).json({
            success: false,
            message: "Lỗi server",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// 🏥 3. Lấy danh sách lịch khám theo bệnh nhân
exports.getBookingsByPatient = async (req, res) => {
    try {
        const patientId = parseInt(req.params.patientId, 10);
        console.log('Patient ID nhận được:', patientId);

        if (isNaN(patientId) || patientId <= 0) {
            return res.status(400).json({ success: false, message: 'Patient ID không hợp lệ' });
        }

        const bookings = await db.Booking.findAll({
            where: { patientId: patientId },
            include: [
                {
                    model: db.User,
                    as: 'patientData',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'address', 'gender', 'phoneNumber', 'image']
                },
                {
                    model: db.User,
                    as: 'doctorData',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'address', 'gender', 'phoneNumber', 'image'],
                    include: [
                        {
                            model: db.DoctorDetail,
                            as: 'doctorDetail',
                            attributes: ['descriptionMarkdown', 'descriptionHTML']
                        },
                        {
                            model: db.Specialty,
                            attributes: ['id', 'name', 'image', 'description']
                        },
                        {
                            model: db.Allcode,
                            as: 'roleData',
                            attributes: ['keyMap', 'valueVi', 'valueEn']
                        },
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['keyMap', 'valueVi', 'valueEn']
                        }
                    ]
                },
                {
                    model: db.Allcode,
                    as: 'statusData',
                    attributes: ['keyMap', 'valueVi', 'valueEn']
                },
                {
                    model: db.Allcode,
                    as: 'timeTypeData',
                    attributes: ['keyMap', 'valueVi', 'valueEn']
                }
            ],
            order: [['date', 'ASC']],
        });

        if (!bookings || bookings.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: 'Không có đặt lịch nào cho bệnh nhân này',
            });
        }

        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách đặt lịch:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi server',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// ❌ 4. Hủy lịch khám (Bác sĩ hoặc bệnh nhân có thể hủy)
exports.cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await db.Booking.findByPk(id);
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

        const deleted = await db.Booking.destroy({
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

// Lấy chi tiết lịch khám theo id
exports.getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ success: false, message: 'Thiếu id lịch khám' });
        }
        const booking = await db.Booking.findByPk(id, {
            include: [
                {
                    model: db.User,
                    as: 'patientData',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'address', 'gender', 'phoneNumber', 'image']
                },
                {
                    model: db.User,
                    as: 'doctorData',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'address', 'gender', 'phoneNumber', 'image'],
                    include: [
                        {
                            model: db.DoctorDetail,
                            as: 'doctorDetail',
                            attributes: ['descriptionMarkdown', 'descriptionHTML']
                        },
                        {
                            model: db.Specialty,
                            attributes: ['id', 'name', 'image', 'description']
                        },
                        {
                            model: db.Allcode,
                            as: 'roleData',
                            attributes: ['keyMap', 'valueVi', 'valueEn']
                        },
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['keyMap', 'valueVi', 'valueEn']
                        }
                    ]
                },
                {
                    model: db.Allcode,
                    as: 'statusData',
                    attributes: ['keyMap', 'valueVi', 'valueEn']
                }
            ]
        });
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy lịch khám' });
        }
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
    }
};
