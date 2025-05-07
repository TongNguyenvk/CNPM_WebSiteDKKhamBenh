const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const protect = require('../middleware/authMiddleware'); // Nếu bạn muốn bảo vệ route này

/**
 * @swagger
 * /api/doctor:
 *   post:
 *     summary: Tạo bác sĩ mới
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - specialtyId
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID của người dùng
 *               specialtyId:
 *                 type: integer
 *                 description: ID của chuyên khoa
 *               description:
 *                 type: string
 *                 description: Mô tả về bác sĩ
 *     responses:
 *       201:
 *         description: Tạo bác sĩ thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 */
router.post('/', doctorController.createDoctor);

/**
 * @swagger
 * /api/doctor/{id}:
 *   get:
 *     summary: Lấy thông tin bác sĩ theo ID
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bác sĩ
 *     responses:
 *       200:
 *         description: Thông tin bác sĩ
 *       404:
 *         description: Không tìm thấy bác sĩ
 */
router.get('/:id', doctorController.getDoctor);

/**
 * @swagger
 * /api/doctor/{id}:
 *   put:
 *     summary: Cập nhật thông tin bác sĩ
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bác sĩ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specialtyId:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy bác sĩ
 */
router.put('/:id', doctorController.updateDoctor);

/**
 * @swagger
 * /api/doctor/{id}:
 *   delete:
 *     summary: Xóa bác sĩ
 *     tags: [Doctors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của bác sĩ
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy bác sĩ
 */
router.delete('/:id', doctorController.deleteDoctor);

/**
 * @swagger
 * /api/doctor:
 *   get:
 *     summary: Lấy danh sách tất cả bác sĩ
 *     tags: [Doctors]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng bác sĩ mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách bác sĩ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doctors:
 *                   type: array
 *                   items:
 *                     type: object
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 */
router.get('/', doctorController.getAllDoctors);

/**
 * @swagger
 * /api/doctor/specialty/{id}:
 *   get:
 *     summary: Lấy danh sách bác sĩ theo chuyên khoa
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của chuyên khoa
 *     responses:
 *       200:
 *         description: Danh sách bác sĩ theo chuyên khoa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Không tìm thấy chuyên khoa
 */
router.get('/specialty/:id', doctorController.getDoctorsBySpecialty);

module.exports = router;