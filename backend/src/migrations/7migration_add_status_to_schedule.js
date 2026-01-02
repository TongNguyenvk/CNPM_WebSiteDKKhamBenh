'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Schedules', 'status', {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      allowNull: false,
      defaultValue: 'approved', // Mặc định approved cho các schedule cũ và schedule do admin tạo
      comment: 'Trạng thái duyệt: pending (chờ duyệt), approved (đã duyệt), rejected (từ chối)'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Schedules', 'status');
    // Xóa ENUM type nếu cần
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Schedules_status";');
  }
};
