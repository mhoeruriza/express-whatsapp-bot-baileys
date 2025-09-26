'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('wa_sessions', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            session_data: {
                type: Sequelize.JSONB, // simpan state/creds dari baileys
                allowNull: false,
            },
            whatsapp_keys: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },
        })
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
    }
};
