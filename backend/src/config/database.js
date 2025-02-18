const Sequelize = require('sequelize');
require('dotenv').config();
const path = require('path');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,

  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT,
    logging: false
  }
);



module.exports = sequelize;