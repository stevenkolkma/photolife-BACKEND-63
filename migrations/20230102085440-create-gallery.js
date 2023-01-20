"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("galleries", {
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
      description: {
        type: Sequelize.TEXT,
      },
      date: {
        type: Sequelize.DATE,
      },
      thumbnail: {
        type: Sequelize.TEXT,
        defaultValue:
          "https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/256x256/folder.png",
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
    await queryInterface.dropTable("galleries");
  },
};
