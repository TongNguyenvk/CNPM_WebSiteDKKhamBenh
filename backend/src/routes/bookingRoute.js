const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Đặt lịch khám bệnh
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - scheduleId
 *               - patientId
 *             properties:
 *               scheduleId:
 *                 type: integer
 *                 description: ID của lịch khám
 *               patientId:
 *                 type: integer
 *                 description: ID của bệnh nhân
 *               reason:
 *                 type: string
 *                 description: Lý do khám bệnh
 *     responses:
 *       201:
 *         description: Đặt lịch thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 */
router.post('/', protect, authorizeRoles('R1'), bookingController.createBooking);

/**
 * @swagger
 * /api/bookings/doctor/{doctorId}:
 *   get:
 *     summary: Lấy danh sách lịch hẹn theo bác sĩ
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bác sĩ
 *     responses:
 *       200:
 *         description: Danh sách lịch hẹn
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Không có quyền truy cập
 */
router.get('/doctor/:doctorId', protect, authorizeRoles('R2', 'R3'), bookingController.getBookingsByDoctor);

/**
 * @swagger
 * /api/bookings/patient/{patientId}:
 *   get:
 *     summary: Lấy danh sách lịch hẹn theo bệnh nhân
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bệnh nhân
 *     responses:
 *       200:
 *         description: Danh sách lịch hẹn
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: Không có quyền truy cập
 */
router.get('/patient/:patientId', protect, authorizeRoles('R1', 'R3'), bookingController.getBookingsByPatient);

/**
 * @swagger
 * /api/bookings/cancel/{id}:
 *   put:
 *     summary: Hủy lịch hẹn
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của lịch hẹn
 *     responses:
 *       200:
 *         description: Hủy lịch thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy lịch hẹn
 */
router.put('/cancel/:id', protect, authorizeRoles('R1', 'R2', 'R3'), bookingController.cancelBooking);

/**
 * @swagger
 * /api/bookings/{id}:
 *   get:
 *     summary: Lấy chi tiết lịch hẹn
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của lịch hẹn
 *     responses:
 *       200:
 *         description: Chi tiết lịch hẹn
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy lịch hẹn
 */
router.get('/:id', protect, authorizeRoles('R1', 'R2', 'R3'), bookingController.getBookingById);

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   put:
 *     summary: Cập nhật trạng thái lịch khám
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của lịch khám
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy lịch khám
 */
router.put('/:id/status', protect, authorizeRoles('R1', 'R2', 'R3'), bookingController.updateBookingStatus);

module.exports = router;
