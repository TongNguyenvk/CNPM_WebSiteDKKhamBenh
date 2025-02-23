// seeders/[timestamp]-demo-specialties.js
const { faker } = require('@faker-js/faker');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const specialties = [];
        for (let i = 0; i < 3; i++) {
            specialties.push({
                name: faker.person.jobType(),
                image: faker.image.url(),
                descriptionHTML: faker.lorem.paragraph(),
                descriptionMarkdown: faker.lorem.paragraph(),
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        return queryInterface.bulkInsert('Specialties', specialties, {});
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Specialties', null, {});
    }
};