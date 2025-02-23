// seeders/[timestamp]-demo-doctor-details.js
const { faker } = require('@faker-js/faker');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Lấy danh sách các bác sĩ (roleId = 'R2')
        const doctors = await queryInterface.sequelize.query(
            `SELECT id FROM Users WHERE roleId = 'R2';`,
            { type: queryInterface.sequelize.QueryTypes.SELECT }
        );

        if (!doctors || doctors.length === 0) {
            console.warn('Không có bác sĩ nào để tạo DoctorDetail.');
            return;
        }

        const doctorDetails = doctors.map(doctor => ({
            doctorId: doctor.id,
            descriptionMarkdown: faker.lorem.paragraphs(2),
            descriptionHTML: faker.lorem.paragraphs(2),
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        return queryInterface.bulkInsert('DoctorDetails', doctorDetails, {});
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('DoctorDetails', null, {});
    }
};