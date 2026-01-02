// src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../lib/auth'); // Import hàm verifyToken

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Lấy token từ header
      token = req.headers.authorization.split(' ')[1];

      // Xác minh token
      const decoded = verifyToken(token); // Sử dụng hàm verifyToken

      if (!decoded) {
        return res.status(401).json({ message: 'Không được phép, token không hợp lệ' });
      }

      // Lấy thông tin người dùng từ token
      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(401).json({ message: 'Không được phép, người dùng không tồn tại' });
      }

      req.user = user; // Thêm thông tin người dùng vào request
      next(); // Tiếp tục đến route
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Không được phép, token không hợp lệ' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Không được phép, không có token' });
  }
};

// Middleware kiểm tra quyền truy cập
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.roleId)) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này' });
    }
    next();
  };
};

// Middleware kiểm tra user chỉ được sửa thông tin của chính mình (hoặc admin)
const checkOwnerOrAdmin = (req, res, next) => {
  const requestedUserId = parseInt(req.params.id, 10);
  const currentUserId = req.user.id;
  const isAdmin = req.user.roleId === 'R3';

  if (currentUserId !== requestedUserId && !isAdmin) {
    return res.status(403).json({ message: 'Bạn chỉ có thể chỉnh sửa thông tin của chính mình' });
  }
  next();
};

// Middleware kiểm tra bác sĩ chỉ được quản lý schedule của chính mình (hoặc admin)
const checkScheduleOwnerOrAdmin = async (req, res, next) => {
  try {
    const isAdmin = req.user.roleId === 'R3';
    
    // Admin có toàn quyền
    if (isAdmin) {
      return next();
    }

    // Với POST (tạo mới), kiểm tra doctorId trong body
    if (req.method === 'POST') {
      const { doctorId } = req.body;
      if (parseInt(doctorId, 10) !== req.user.id) {
        return res.status(403).json({ message: 'Bạn chỉ có thể tạo lịch cho chính mình' });
      }
      return next();
    }

    // Với PUT/DELETE, kiểm tra schedule có thuộc về bác sĩ này không
    const { Schedule } = require('../models');
    const scheduleId = req.params.id;
    const schedule = await Schedule.findByPk(scheduleId);
    
    if (!schedule) {
      return res.status(404).json({ message: 'Không tìm thấy lịch khám' });
    }

    if (schedule.doctorId !== req.user.id) {
      return res.status(403).json({ message: 'Bạn chỉ có thể chỉnh sửa lịch của chính mình' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

module.exports = { protect, authorizeRoles, checkOwnerOrAdmin, checkScheduleOwnerOrAdmin };