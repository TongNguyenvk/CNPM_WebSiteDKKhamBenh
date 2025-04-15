// models/index.js
const fs = require('fs');
const path = require('path');
const sequelize = require('../config/database');
const basename = path.basename(__filename);
const db = {};

// Đọc tất cả các file model trong thư mục models (ngoại trừ index.js)
fs.readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        const model = require(path.join(__dirname, file));
        db[model.name] = model;
    });

// Thiết lập các associations nếu model có hàm associate
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

// Gán đối tượng kết nối sequelize và class Sequelize vào db để sử dụng ở các nơi khác
db.sequelize = sequelize;
db.Sequelize = sequelize.Sequelize;

module.exports = db;

// Đồng bộ CSDL: tạo bảng từ model nếu chưa có
const initDB = async () => {
    try {
      await sequelize.sync({ alter: true }); // hoặc { force: true } nếu muốn xóa bảng cũ
      console.log('✅ Database synced successfully!');
    } catch (err) {
      console.error('❌ Failed to sync DB:', err);
    }
  };
  
  initDB(); // Gọi hàm khi load models
  