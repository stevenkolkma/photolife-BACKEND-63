"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "galleries",
      [
        {
          name: "pig",
          description: "asdf",
          date: new Date(),
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "cat",
          description: "asdf",
          date: new Date(),
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "cow",
          description: "asdf",
          date: new Date(),
          userId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("galleries", null, {});
  },
};
