"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class purchase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      purchase.belongsTo(models.user, { foreignKey: "userId" });
      purchase.belongsTo(models.photo, { foreignKey: "photoId" });
    }
  }
  purchase.init(
    {
      userId: { type: DataTypes.INTEGER },
      photoId: { type: DataTypes.INTEGER },
    },
    {
      sequelize,
      modelName: "purchase",
    }
  );
  return purchase;
};
