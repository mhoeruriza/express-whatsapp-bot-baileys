'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
        await queryInterface.bulkInsert('roles', [
            {
                id: 1,
                name: 'Admin',
                slug: 'admin',
                created_at: new Date(),
                updated_at: new Date(),
            }
        ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
