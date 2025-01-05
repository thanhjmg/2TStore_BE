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
    brandName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "brand",
  }
);
module.exports = Brand;
