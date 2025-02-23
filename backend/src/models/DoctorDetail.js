const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DoctorDetail = sequelize.define('DoctorDetail', {
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'Users', // This should match the actual table name
      key: 'id'
    }
  },
  descriptionMarkdown: DataTypes.TEXT,
  descriptionHTML: DataTypes.TEXT
}, {
  tableName: 'DoctorDetails', // Optional: Explicitly define the table name
  timestamps: true, // Enable timestamps (createdAt, updatedAt)
  underscored: false, // Use camelCase for attributes
});

DoctorDetail.associate = function (models) {
  DoctorDetail.belongsTo(models.User, {
    foreignKey: 'doctorId',
    as: 'doctor'
  });
};

module.exports = DoctorDetail;