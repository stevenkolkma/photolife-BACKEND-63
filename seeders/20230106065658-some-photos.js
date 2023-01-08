"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "photos",
      [
        {
          name: "Picture1",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png",
          caption: "A photo about stuff",
          price: 15.0,
          dateTaken: new Date(),
          metaData:
            "asd;lkfjadsf;ldsf;ladsflk;joifepie38p9 qp92e8f q2ef98pn q2ef9p p98q 2fewdanf laskdf n 92 feqn",
          galleryId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Picture2",
          imageUrl:
            "https://media.sproutsocial.com/uploads/2017/02/10x-featured-social-media-image-size.png",
          caption: "A photo about stuff",
          price: 50.0,
          dateTaken: new Date(),
          metaData:
            "asd;lkfjadsf;ldsf;ladsflk;joifepie38p9 qp92e8f q2ef98pn q2ef9p p98q 2fewdanf laskdf n 92 feqn",
          galleryId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Picture3",
          imageUrl:
            "https://imgv3.fotor.com/images/blog-cover-image/part-blurry-image.jpg",
          price: 100.0,
          dateTaken: new Date(),
          metaData:
            "asd;lkfjadsf;ldsf;ladsflk;joifepie38p9 qp92e8f q2ef98pn q2ef9p p98q 2fewdanf laskdf n 92 feqn",
          galleryId: 3,
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
