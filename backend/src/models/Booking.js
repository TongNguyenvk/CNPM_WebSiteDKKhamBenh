const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Import sequelize instance

const Booking = sequelize.define('Booking', {
  statusId: DataTypes.STRING,
  doctorId: DataTypes.INTEGER,
  patientId: DataTypes.INTEGER,
  date: DataTypes.DATE,
  timeType: DataTypes.STRING,
  token: DataTypes.STRING
}, {
  tableName: 'Bookings',
  timestamps: true,
});

Booking.associate = function (models) {
  Booking.belongsTo(models.Allcode, { foreignKey: 'statusId', targetKey: 'keyMap', as: 'statusData' });
  Booking.belongsTo(models.User, { foreignKey: 'doctorId', as: 'doctorData' });
  Booking.belongsTo(models.User, { foreignKey: 'patientId', as: 'patientData' });
};

module.exports = Booking;