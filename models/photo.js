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
      photo.belongsTo(models.user, { foreignKey: "userId" });
      photo.belongsToMany(models.user, {
        through: "purchase",
        foreignKey: "photoId",
      });
    }
  }
  photo.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      imageUrl: { type: DataTypes.TEXT },
      caption: { type: DataTypes.STRING },
      metaData: {
        type: DataTypes.TEXT,
        defaultValue: `Date taken: ${new Date()}`,
      },
      publicId: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "photo",
    }
  );
  return photo;
};
