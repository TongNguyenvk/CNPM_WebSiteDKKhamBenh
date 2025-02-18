module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      statusId: {
        type: Sequelize.STRING,
        references: { // Tạo khóa ngoại
          model: 'Allcodes', // Tham chiếu đến bảng Allcodes
          key: 'keyMap' // Tham chiếu đến cột keyMap
        },
        onUpdate: 'CASCADE', // Cập nhật statusId trong Bookings nếu keyMap trong Allcodes thay đổi
        onDelete: 'CASCADE' // Xóa Booking nếu keyMap trong Allcodes bị xóa
      },
      doctorId: {
        type: Sequelize.INTEGER,
        references: { // Tạo khóa ngoại
          model: 'Users', // Tham chiếu đến bảng Users
          key: 'id' // Tham chiếu đến cột id
        },
        onUpdate: 'CASCADE', // Cập nhật doctorId trong Bookings nếu id trong Users thay đổi
        onDelete: 'CASCADE' // Xóa Booking nếu User bị xóa
      },
      patientId: {
        type: Sequelize.INTEGER,
        references: { // Tạo khóa ngoại
          model: 'Users', // Tham chiếu đến bảng Users
          key: 'id' // Tham chiếu đến cột id
        },
        onUpdate: 'CASCADE', // Cập nhật patientId trong Bookings nếu id trong Users thay đổi
        onDelete: 'CASCADE' // Xóa Booking nếu User bị xóa
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
        onUpdate: 'CASCADE', // Cập nhật timeType trong Bookings nếu keyMap trong Allcodes thay đổi
        onDelete: 'CASCADE' // Xóa Booking nếu keyMap trong Allcodes bị xóa
      },
      token: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Bookings');
  }
};