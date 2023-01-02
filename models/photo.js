"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      photo.belongsTo(models.gallery, { foreignKey: "galleryId" });
      photo.belongsToMany(models.user, {
        through: "purchase",
        foreignKey: "photoId",
      });
    }
  }
  photo.init(
    {
      name: DataTypes.STRING,
      imageUrl: DataTypes.STRING,
      caption: DataTypes.STRING,
      price: DataTypes.INTEGER,
      dateTaken: DataTypes.DATE,
      metaData: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "photo",
    }
  );
  return photo;
};
