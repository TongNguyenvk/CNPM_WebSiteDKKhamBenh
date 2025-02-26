// routes/scheduleRoutes.js
const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const protect = require('../middleware/authMiddleware'); // Nếu bạn muốn bảo vệ route này

//router.get('/doctor/:doctorId', scheduleController.getDoctorSchedules);
router.get('/', scheduleController.getAllSchedules);

// Lấy schedule theo id
router.get('/:id', scheduleController.getScheduleById);

// Tạo mới schedule
router.post('/', scheduleController.createSchedule);

// Cập nhật schedule theo id
router.put('/:id', scheduleController.updateSchedule);

// Xoá schedule theo id
router.delete('/:id', scheduleController.deleteSchedule);
router.get("/doctor/:doctorId", scheduleController.getDoctorSchedule);

module.exports = router;