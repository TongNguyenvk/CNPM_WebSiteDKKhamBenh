const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Import sequelize instance

const DoctorDetail = sequelize.define('DoctorDetail', {
  doctorId: DataTypes.INTEGER,
  descriptionMarkdown: DataTypes.TEXT,
  descriptionHTML: DataTypes.TEXT
}, {
  tableName: 'DoctorDetails',
  timestamps: true,
});

DoctorDetail.associate = function (models) {
  DoctorDetail.belongsTo(models.User, { foreignKey: 'doctorId' });
};

module.exports = DoctorDetail;