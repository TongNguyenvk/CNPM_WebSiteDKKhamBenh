// seeders/[timestamp]-demo-bookings.js
const { v4: uuidv4 } = require('uuid');
const { faker } = require('@faker-js/faker');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Lấy danh sách bệnh nhân (roleId = 'R1')
        const patients = await queryInterface.sequelize.query(
            `SELECT id FROM Users WHERE roleId = 'R1';`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        if (!patients || patients.length === 0) {
            console.warn('Không có bệnh nhân nào để tạo Booking.');
            return;
        }

        // Lấy danh sách các bác sĩ (roleId = 'R2')
        const doctors = await queryInterface.sequelize.query(
            `SELECT id FROM Users WHERE roleId = 'R2';`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        if (!doctors || doctors.length === 0) {
            console.warn('Không có bác sĩ nào để tạo Booking.');
            return;
        }

        // Lấy danh sách timeType (type = 'TIME')
        const timeTypes = await queryInterface.sequelize.query(
            `SELECT keyMap FROM Allcodes WHERE type = 'TIME';`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        if (!timeTypes || timeTypes.length === 0) {
            console.warn('Không có timeType nào để tạo Booking.');
            return;
        }

        const bookings = [];
        const numBookings = 5; // Số lượng booking muốn tạo

        for (let i = 0; i < numBookings; i++) {
            const randomPatient = faker.helpers.arrayElement(patients);
            const randomDoctor = faker.helpers.arrayElement(doctors);
            const randomTimeType = faker.helpers.arrayElement(timeTypes);

            const bookingDate = faker.date.future(); // Ngày ngẫu nhiên trong tương lai

            bookings.push({
                statusId: 'S1', // Chờ xác nhận
                doctorId: randomDoctor.id,
                patientId: randomPatient.id,
                date: bookingDate,
                timeType: randomTimeType.keyMap,
                token: uuidv4(),
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        return queryInterface.bulkInsert('Bookings', bookings, {});
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Bookings', null, {});
    }
};