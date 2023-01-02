"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user.hasMany(models.gallery, { foreignKey: "userId" });
      user.belongsToMany(models.photo, {
        through: "purchase",
        foreignKey: "userId",
      });
    }
  }
  user.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      phone: { type: DataTypes.INTEGER },
      address: { type: DataTypes.STRING },
      avatar: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
