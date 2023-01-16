"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "photos",
      [
        {
          name: "Picture1",
          imageUrl:
            "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg",
          caption: "A photo about stuff",
          metaData: `Price: 15, DateTaken: ${new Date()}`,
          galleryId: 1,
          userId: 1,
          publicId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Picture2",
          imageUrl:
            "https://st.depositphotos.com/1288351/1322/i/600/depositphotos_13224689-stock-photo-single-tree-space-background.jpg",
          caption: "A photo about stuff",
          metaData: `Price: 15, DateTaken: ${new Date()}`,
          galleryId: 2,
          userId: 2,
          publicId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Picture3",
          imageUrl:
            "https://thumbs.dreamstime.com/b/starry-sky-pink-milky-way-trees-night-landscape-alone-hill-against-colorful-amazing-galaxy-nature-87458498.jpg",
          caption: " A photo about stuff",
          metaData: `Price: 15, DateTaken: ${new Date()}`,
          galleryId: 3,
          userId: 3,
          publicId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("photos", null, {});
  },
};
