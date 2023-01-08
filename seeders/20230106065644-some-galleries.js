"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "galleries",
      [
        {
          name: "pig",
          description: "asdf",
          thumbnail:
            "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
          date: new Date(),
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "cat",
          description: "asdf",
          thumbnail:
            "https://st.depositphotos.com/1288351/1322/i/600/depositphotos_13224689-stock-photo-single-tree-space-background.jpg",
          date: new Date(),
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "cow",
          description: "asdf",
          thumbnail:
            "https://thumbs.dreamstime.com/b/starry-sky-pink-milky-way-trees-night-landscape-alone-hill-against-colorful-amazing-galaxy-nature-87458498.jpg",
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
