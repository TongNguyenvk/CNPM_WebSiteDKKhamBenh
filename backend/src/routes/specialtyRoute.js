// src/routes/specialtyRoutes.js
const express = require('express');
const router = express.Router();
const specialtyController = require('../controllers/specialtyController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục uploads/specialties nếu chưa có
const uploadDir = path.join(__dirname, '../../uploads/specialties');
console.log('[SPECIALTY ROUTE] Upload directory:', uploadDir);
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('[SPECIALTY ROUTE] Created upload directory');
}

// Cấu hình multer cho upload ảnh chuyên khoa
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('[MULTER] Saving to:', uploadDir);
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        console.log('[MULTER] Filename:', filename);
        cb(null, filename);
    }
});

const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPG, PNG, GIF, WEBP allowed.'));
        }
    }
});

/**
 * @swagger
 * /api/specialties/upload:
 *   post:
 *     summary: Upload ảnh chuyên khoa
 *     tags: [Specialties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Upload thành công
 *       400:
 *         description: File không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 */
router.post('/upload', protect, authorizeRoles('R3'), upload.single('image'), specialtyController.uploadImage);

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
router.post('/', protect, authorizeRoles('R3'), specialtyController.createSpecialty);

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
router.put('/:id', protect, authorizeRoles('R3'), specialtyController.updateSpecialty);

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
router.delete('/:id', protect, authorizeRoles('R3'), specialtyController.deleteSpecialty);

module.exports = router;