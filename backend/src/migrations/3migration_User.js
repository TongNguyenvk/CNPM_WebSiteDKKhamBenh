module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        unique: true // Đảm bảo email là duy nhất
      },
      password: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.BOOLEAN
      },
      roleId: {
        type: Sequelize.STRING,
        references: { // Tạo khóa ngoại
          model: 'Allcodes', // Tham chiếu đến bảng Allcodes
          key: 'keyMap' // Tham chiếu đến cột keyMap
        },
        onUpdate: 'CASCADE', // Cập nhật roleId trong Users nếu keyMap trong Allcodes thay đổi
        onDelete: 'SET NULL' // Đặt roleId thành NULL nếu keyMap trong Allcodes bị xóa
      },
      phoneNumber: {
        type: Sequelize.STRING
      },
      positionId: {
        type: Sequelize.STRING,
        references: { // Tạo khóa ngoại
          model: 'Allcodes', // Tham chiếu đến bảng Allcodes
          key: 'keyMap' // Tham chiếu đến cột keyMap
        },
        onUpdate: 'CASCADE', // Cập nhật positionId trong Users nếu keyMap trong Allcodes thay đổi
        onDelete: 'SET NULL' // Đặt positionId thành NULL nếu keyMap trong Allcodes bị xóa
      },
      specialtyId: { // Nếu dùng quan hệ một-nhiều
        type: Sequelize.INTEGER,
        references: { // Tạo khóa ngoại
          model: 'Specialties', // Tham chiếu đến bảng Specialties
          key: 'id' // Tham chiếu đến cột id
        },
        onUpdate: 'CASCADE', // Cập nhật specialtyId trong Users nếu id trong Specialties thay đổi
        onDelete: 'SET NULL' // Đặt specialtyId thành NULL nếu id trong Specialties bị xóa
      },
      image: {
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
    await queryInterface.dropTable('Users');
  }
};