const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Đặt lịch: chỉ bệnh nhân
router.post('/', protect, authorizeRoles('R1'), bookingController.createBooking);
// Lấy lịch theo bác sĩ: chỉ bác sĩ hoặc admin
router.get('/doctor/:doctorId', protect, authorizeRoles('R2', 'R3'), bookingController.getBookingsByDoctor);
// Lấy lịch theo bệnh nhân: chỉ bệnh nhân hoặc admin
router.get('/patient/:patientId', protect, authorizeRoles('R1', 'R3'), bookingController.getBookingsByPatient);
// Hủy lịch: bác sĩ, bệnh nhân, admin
router.put('/cancel/:id', protect, authorizeRoles('R1', 'R2', 'R3'), bookingController.cancelBooking);
// Lấy chi tiết booking: bác sĩ, bệnh nhân, admin
router.get('/:id', protect, authorizeRoles('R1', 'R2', 'R3'), bookingController.getBookingById);
//router.delete('/cleanup', bookingController.cleanupOldBookings);

module.exports = router;
