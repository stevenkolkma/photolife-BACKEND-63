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
        defaultValue:
          "https://d1nhio0ox7pgb.cloudfront.net/_img/g_collection_png/standard/256x256/folder.png",
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
