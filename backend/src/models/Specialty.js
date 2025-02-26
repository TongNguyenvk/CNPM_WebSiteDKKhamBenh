const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Import sequelize instance

const Specialty = sequelize.define('Specialty', {
  name: DataTypes.STRING,
  image: DataTypes.STRING,
  description: DataTypes.TEXT,
  //descriptionMarkdown: DataTypes.TEXT
}, {
  tableName: 'Specialties',
  timestamps: true,
});

Specialty.associate = function (models) {
  Specialty.hasMany(models.User, { foreignKey: 'specialtyId' }); // Nếu dùng quan hệ một-nhiều
  // Specialty.belongsToMany(models.User, { through: 'Doctor_Specialty', foreignKey: 'specialtyId', otherKey: 'doctorId' }); // Nếu dùng quan hệ nhiều-nhiều
};

module.exports = Specialty;