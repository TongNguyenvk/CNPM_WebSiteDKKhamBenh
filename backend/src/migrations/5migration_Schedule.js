module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Schedules', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      doctorId: {
        type: Sequelize.INTEGER,
        references: { // Tạo khóa ngoại
          model: 'Users', // Tham chiếu đến bảng Users
          key: 'id' // Tham chiếu đến cột id
        },
        onUpdate: 'CASCADE', // Cập nhật doctorId trong Schedules nếu id trong Users thay đổi
        onDelete: 'CASCADE' // Xóa Schedule nếu User bị xóa
      },
      date: {
        type: Sequelize.DATE
      },
      timeType: {
        type: Sequelize.STRING,
        references: { // Tạo khóa ngoại
          model: 'Allcodes', // Tham chiếu đến bảng Allcodes
          key: 'keyMap' // Tham chiếu đến cột keyMap
        },
        onUpdate: 'CASCADE', // Cập nhật timeType trong Schedules nếu keyMap trong Allcodes thay đổi
        onDelete: 'CASCADE' // Xóa Schedule nếu keyMap trong Allcodes bị xóa
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
    await queryInterface.dropTable('Schedules');
  }
};