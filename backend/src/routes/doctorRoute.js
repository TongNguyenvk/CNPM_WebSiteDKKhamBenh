const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const protect = require('../middleware/authMiddleware'); // Nếu bạn muốn bảo vệ route này

router.post('/', doctorController.createDoctor); // Yêu cầu xác thực và quyền (ví dụ: admin)
router.get('/:id', doctorController.getDoctor);
router.put('/:id', doctorController.updateDoctor); // Yêu cầu xác thực và quyền (ví dụ: admin)
router.delete('/:id', doctorController.deleteDoctor); // Yêu cầu xác thực và quyền (ví dụ: admin)
router.get('/', doctorController.getAllDoctors);

module.exports = router;