'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('roles', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING(100),
                allowNull: false
            },
            slug: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW')
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('roles');
    }
};
