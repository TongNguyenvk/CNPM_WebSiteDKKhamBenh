const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Import sequelize instance

const Schedule = sequelize.define('Schedule', {
  doctorId: DataTypes.INTEGER,
  date: DataTypes.DATE,
  timeType: DataTypes.STRING
}, {
  tableName: 'Schedules',
  timestamps: true,
});

Schedule.associate = function (models) {
  Schedule.belongsTo(models.User, { foreignKey: 'doctorId' });
  Schedule.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeData' });
};

module.exports = Schedule;