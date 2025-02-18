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

module.exports = { protect };