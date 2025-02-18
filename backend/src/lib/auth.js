// src/lib/auth.js
const jwt = require('jsonwebtoken');

// Hàm tạo JWT
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Hàm xác thực JWT
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null; // Token không hợp lệ
  }
};

module.exports = { generateToken, verifyToken };