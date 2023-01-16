"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Apple",
          email: "apple@apple.com",
          phone: 1234567,
          password: bcrypt.hashSync("apple", 10),
          avatar:
            "https://bustlingnest.com/wp-content/uploads/popular-apple-varieties.jpg.webp",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Banana",
          email: "banana@banana.com",
          phone: 1234567,
          avatar:
            "https://images.pexels.com/photos/5966630/pexels-photo-5966630.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          password: bcrypt.hashSync("banana", 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Coco",
          email: "coco@coco.com",
          phone: 1234567,
          avatar:
            "https://cdn.shopify.com/s/files/1/2372/1439/articles/April_Blog_image_1024x.jpg?v=1552159727",
          password: bcrypt.hashSync("coco", 10),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
