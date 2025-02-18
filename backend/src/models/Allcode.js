const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Import sequelize instance

const Allcode = sequelize.define('Allcode', {
  keyMap: DataTypes.STRING,
  type: DataTypes.STRING,
  valueEn: DataTypes.STRING,
  valueVi: DataTypes.STRING
}, {
  tableName: 'Allcodes',
  timestamps: true,
});

Allcode.associate = function(models) {
  Allcode.hasMany(models.User, { foreignKey: 'roleId', sourceKey: 'keyMap', as: 'roleData' });
  Allcode.hasMany(models.User, { foreignKey: 'positionId', sourceKey: 'keyMap', as: 'positionData' });
  Allcode.hasMany(models.Schedule, { foreignKey: 'timeType', sourceKey: 'keyMap' });
  Allcode.hasMany(models.Booking, { foreignKey: 'statusId', sourceKey: 'keyMap' });
};

module.exports = Allcode;