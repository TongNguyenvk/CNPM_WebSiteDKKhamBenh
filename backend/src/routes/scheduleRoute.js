// routes/scheduleRoutes.js
const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { protect, authorizeRoles, checkScheduleOwnerOrAdmin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/schedules:
 *   get:
 *     summary: Lấy danh sách tất cả lịch khám
 *     tags: [Schedules]
 *     responses:
 *       200:
 *         description: Danh sách lịch khám
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', scheduleController.getAllSchedules);

/**
 * @swagger
 * /api/schedules/{id}:
 *   get:
 *     summary: Lấy thông tin lịch khám theo ID
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của lịch khám
 *     responses:
 *       200:
 *         description: Thông tin lịch khám
 *       404:
 *         description: Không tìm thấy lịch khám
 */
router.get('/:id', scheduleController.getScheduleById);

/**
 * @swagger
 * /api/schedules:
 *   post:
 *     summary: Tạo lịch khám mới
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doctorId
 *               - date
 *               - timeSlot
 *             properties:
 *               doctorId:
 *                 type: integer
 *                 description: ID của bác sĩ
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Ngày khám
 *               timeSlot:
 *                 type: string
 *                 description: Ca khám
 *     responses:
 *       201:
 *         description: Tạo lịch khám thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 */
router.post('/', protect, authorizeRoles('R2', 'R3'), checkScheduleOwnerOrAdmin, scheduleController.createSchedule);

/**
 * @swagger
 * /api/schedules/{id}:
 *   put:
 *     summary: Cập nhật thông tin lịch khám
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của lịch khám
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               timeSlot:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy lịch khám
 */
router.put('/:id', protect, authorizeRoles('R2', 'R3'), checkScheduleOwnerOrAdmin, scheduleController.updateSchedule);

/**
 * @swagger
 * /api/schedules/{id}:
 *   delete:
 *     summary: Xóa lịch khám
 *     tags: [Schedules]
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
 *         description: Xóa thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy lịch khám
 */
router.delete('/:id', protect, authorizeRoles('R2', 'R3'), checkScheduleOwnerOrAdmin, scheduleController.deleteSchedule);

/**
 * @swagger
 * /api/schedules/doctor/{doctorId}:
 *   get:
 *     summary: Lấy danh sách lịch khám của bác sĩ
 *     tags: [Schedules]
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bác sĩ
 *     responses:
 *       200:
 *         description: Danh sách lịch khám của bác sĩ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Không tìm thấy bác sĩ
 */
router.get("/doctor/:doctorId", scheduleController.getDoctorSchedules);

/**
 * @swagger
 * /api/schedules/pending:
 *   get:
 *     summary: Lấy danh sách lịch chờ duyệt (chỉ Admin)
 *     tags: [Schedules]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách lịch chờ duyệt
 *       401:
 *         description: Không có quyền truy cập
 */
router.get("/pending/list", protect, authorizeRoles('R3'), scheduleController.getPendingSchedules);

/**
 * @swagger
 * /api/schedules/{id}/approve:
 *   put:
 *     summary: Duyệt lịch khám (chỉ Admin)
 *     tags: [Schedules]
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
 *         description: Duyệt thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy lịch khám
 */
router.put("/:id/approve", protect, authorizeRoles('R3'), scheduleController.approveSchedule);

/**
 * @swagger
 * /api/schedules/{id}/reject:
 *   put:
 *     summary: Từ chối lịch khám (chỉ Admin)
 *     tags: [Schedules]
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
 *         description: Từ chối thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy lịch khám
 */
router.put("/:id/reject", protect, authorizeRoles('R3'), scheduleController.rejectSchedule);

module.exports = router;