const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('DBDKKHAMBENH', 'root', '123456', {
  host: 'cnpm_websitedkkhambenh-db-mysql-1',
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => console.log('✅ Kết nối thành công!'))
  .catch(err => console.error('❌ Lỗi kết nối:', err));

