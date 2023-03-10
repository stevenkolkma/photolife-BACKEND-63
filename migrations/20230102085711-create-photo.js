"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("photos", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      imageUrl: {
        type: Sequelize.TEXT,
      },
      caption: {
        type: Sequelize.STRING,
      },
      metaData: {
        type: Sequelize.TEXT,
        defaultValue: `Date taken: ${new Date()}`,
      },
      price: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 5 },
      publicId: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("photos");
  },
};
