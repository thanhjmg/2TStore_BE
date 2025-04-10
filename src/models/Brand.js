const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Brand = sequelize.define(
  "Brand",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // Đặt id là khóa chính
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      // allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: true,
    tableName: "brand",
  }
);
module.exports = Brand;
