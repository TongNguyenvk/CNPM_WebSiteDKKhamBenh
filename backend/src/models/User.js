// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs'); // Import bcrypt

const User = sequelize.define('User', {
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    validate: {
      len: [6, 100] // Độ dài mật khẩu tối thiểu là 6 ký tự
    }
  },
  address: DataTypes.STRING,
  gender: DataTypes.BOOLEAN,
  roleId: DataTypes.STRING,
  phoneNumber: DataTypes.STRING,
  positionId: DataTypes.STRING,
  image: DataTypes.STRING,
  specialtyId: DataTypes.INTEGER
}, {
  tableName: 'Users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {  // Để băm mật khẩu khi cập nhật
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  },
  instanceMethods: { // Thêm phương thức so sánh mật khẩu
    validPassword: function (password) {
      return bcrypt.compareSync(password, this.password);
    }
  }
});

User.associate = function (models) {
  User.belongsTo(models.Allcode, { foreignKey: 'roleId', targetKey: 'keyMap', as: 'roleData' });
  User.belongsTo(models.Allcode, { foreignKey: 'positionId', targetKey: 'keyMap', as: 'positionData' });
  User.hasMany(models.Schedule, { foreignKey: 'doctorId', as: 'doctorData' });
  User.hasMany(models.Booking, { foreignKey: 'patientId' });
  User.hasOne(models.DoctorDetail, { foreignKey: 'doctorId', as: 'doctorDetail' });
  User.belongsTo(models.Specialty, { foreignKey: 'specialtyId' });
};

module.exports = User;