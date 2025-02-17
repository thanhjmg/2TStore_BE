const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const ProductType = sequelize.define(
  "ProductType",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    tableName: "productType",
  }
);
module.exports = ProductType;
