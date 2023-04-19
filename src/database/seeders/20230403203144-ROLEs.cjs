'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ROLEs', [
      {
        name: 'admin',
      },
      {
        name: 'user',
      },
      {
        name: 'vender',
      },

    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ROLEs', null, {});
  }
};