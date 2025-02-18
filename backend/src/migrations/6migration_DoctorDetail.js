module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DoctorDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      doctorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true, // Mỗi bác sĩ chỉ có 1 bản ghi DoctorDetail
        references: { // Tạo khóa ngoại
          model: 'Users', // Tham chiếu đến bảng Users
          key: 'id' // Tham chiếu đến cột id
        },
        onUpdate: 'CASCADE', // Cập nhật doctorId trong DoctorDetails nếu id trong Users thay đổi
        onDelete: 'CASCADE' // Xóa DoctorDetail nếu User bị xóa
      },
      descriptionMarkdown: {
        type: Sequelize.TEXT
      },
      descriptionHTML: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('DoctorDetails');
  }
};