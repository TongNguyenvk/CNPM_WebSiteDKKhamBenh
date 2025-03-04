const Sequelize = require('sequelize');
require('dotenv').config();
const path = require('path');
const isDocker = process.env.NODE_ENV === 'production'; // Kiểm tra nếu đang chạy trong Docker

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,

  {
    host: isDocker ? process.env.DB_HOST : 'localhost', 
    dialect: 'mysql',
    port: isDocker ? process.env.DB_PORT : 3307,
    logging: false
  }
);



module.exports = sequelize;