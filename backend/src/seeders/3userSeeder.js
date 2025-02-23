// seeders/[timestamp]-demo-users.js
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const hashedPassword = await bcrypt.hash('123456', 10); // Băm mật khẩu mẫu

        const users = [];
        for (let i = 0; i < 5; i++) {
            users.push({
                firstName: faker.person.firstName(),
                lastName: faker.person.lastName(),
                email: faker.internet.email(),
                password: hashedPassword,
                address: faker.location.streetAddress(),
                gender: faker.datatype.boolean(),
                roleId: 'R1', // Bệnh nhân
                phoneNumber: faker.phone.number(),
                positionId: 'P1', // Chuyên gia
                image: faker.image.avatar(),
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        // Thêm một bác sĩ
        users.push({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: hashedPassword,
            address: faker.location.streetAddress(),
            gender: faker.datatype.boolean(),
            roleId: 'R2', // Bác sĩ
            phoneNumber: faker.phone.number(),
            positionId: 'P2', // Trưởng khoa
            image: faker.image.avatar(),
            createdAt: new Date(),
            updatedAt: new Date()
        });

        // Thêm một admin
        users.push({
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: hashedPassword,
            address: faker.location.streetAddress(),
            gender: faker.datatype.boolean(),
            roleId: 'R3', // Quản trị viên
            phoneNumber: faker.phone.number(),
            positionId: 'P3', // Giáo sư
            image: faker.image.avatar(),
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return queryInterface.bulkInsert('Users', users, {});
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Users', null, {});
    }
};