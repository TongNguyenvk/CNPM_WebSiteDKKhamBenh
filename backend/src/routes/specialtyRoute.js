// src/routes/specialtyRoutes.js
const express = require('express');
const router = express.Router();
const specialtyController = require('../controllers/specialtyController');

/**
 * @swagger
 * /api/specialties:
 *   get:
 *     summary: Lấy danh sách tất cả chuyên khoa
 *     tags: [Specialties]
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
 *         description: Số lượng chuyên khoa mỗi trang
 *     responses:
 *       200:
 *         description: Danh sách chuyên khoa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 specialties:
 *                   type: array
 *                   items:
 *                     type: object
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 */
router.get('/', specialtyController.getAllSpecialties);

/**
 * @swagger
 * /api/specialties/{id}:
 *   get:
 *     summary: Lấy thông tin chuyên khoa theo ID
 *     tags: [Specialties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của chuyên khoa
 *     responses:
 *       200:
 *         description: Thông tin chuyên khoa
 *       404:
 *         description: Không tìm thấy chuyên khoa
 */
router.get('/:id', specialtyController.getSpecialtyById);

/**
 * @swagger
 * /api/specialties:
 *   post:
 *     summary: Tạo chuyên khoa mới
 *     tags: [Specialties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Tên chuyên khoa
 *               description:
 *                 type: string
 *                 description: Mô tả chuyên khoa
 *     responses:
 *       201:
 *         description: Tạo chuyên khoa thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 */
router.post('/', specialtyController.createSpecialty);

/**
 * @swagger
 * /api/specialties/{id}:
 *   put:
 *     summary: Cập nhật thông tin chuyên khoa
 *     tags: [Specialties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của chuyên khoa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy chuyên khoa
 */
router.put('/:id', specialtyController.updateSpecialty);

/**
 * @swagger
 * /api/specialties/{id}:
 *   delete:
 *     summary: Xóa chuyên khoa
 *     tags: [Specialties]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của chuyên khoa
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy chuyên khoa
 */
router.delete('/:id', specialtyController.deleteSpecialty);

module.exports = router;