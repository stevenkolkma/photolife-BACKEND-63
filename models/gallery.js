"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class gallery extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      gallery.belongsTo(models.user, { foreignKey: "userId" });
      gallery.hasMany(models.photo, { foreignKey: "galleryId" });
    }
  }
  gallery.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      description: DataTypes.TEXT,
      thumbnail: {
        type: DataTypes.TEXT,
        defaultValue: "https://image.pngaaa.com/301/2691301-middle.png",
      },
      date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "gallery",
    }
  );
  return gallery;
};
