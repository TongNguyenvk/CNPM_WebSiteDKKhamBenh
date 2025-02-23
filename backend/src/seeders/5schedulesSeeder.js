// seeders/[timestamp]-demo-schedules.js
const { faker } = require('@faker-js/faker');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Lấy danh sách các bác sĩ (roleId = 'R2')
        const doctors = await queryInterface.sequelize.query(
            `SELECT id FROM Users WHERE roleId = 'R2';`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        if (!doctors || doctors.length === 0) {
            console.warn('Không có bác sĩ nào để tạo Schedule.');
            return;
        }

        // Lấy tất cả các timeType (type = 'TIME')
        const timeTypes = await queryInterface.sequelize.query(
            `SELECT keyMap FROM Allcodes WHERE type = 'TIME';`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        if (!timeTypes || timeTypes.length === 0) {
            console.warn('Không có timeType nào để tạo Schedule.');
            return;
        }

        const schedules = [];
        const numDays = 3; // Số ngày kể từ ngày hiện tại

        for (let i = 0; i < numDays; i++) {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + i); // Tăng ngày

            for (const doctor of doctors) {
                for (const timeType of timeTypes) {
                    schedules.push({
                        doctorId: doctor.id,
                        date: currentDate,
                        timeType: timeType.keyMap,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    });
                }
            }
        }

        return queryInterface.bulkInsert('Schedules', schedules, {});
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Schedules', null, {});
    }
};