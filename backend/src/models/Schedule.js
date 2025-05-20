const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Import sequelize instance

const Schedule = sequelize.define('Schedule', {
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'doctorId is required'
      }
    }
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'date is required'
      },
      isDate: {
        msg: 'Invalid date format'
      }
    }
  },
  timeType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'timeType is required'
      }
    }
  },
  maxNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: {
        args: [1],
        msg: 'maxNumber must be at least 1'
      }
    }
  },
  currentNumber: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  tableName: 'Schedules',
  timestamps: true,
});

Schedule.associate = function (models) {
  Schedule.belongsTo(models.User, { foreignKey: 'doctorId', as: 'doctorData' });
  Schedule.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeData' });
};

module.exports = Schedule;