"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class orderPhoto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      orderPhoto.belongsTo(models.user, { foreignKey: "userId" });
      orderPhoto.belongsTo(models.photo, { foreignKey: "photoId" });
    }
  }
  orderPhoto.init(
    {
      orderId: DataTypes.INTEGER,
      photoId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      totalPrice: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "orderPhoto",
    }
  );
  return orderPhoto;
};
