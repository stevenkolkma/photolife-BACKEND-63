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
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      thumbnail: DataTypes.STRING,
      date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "gallery",
    }
  );
  return gallery;
};
