const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Size = sequelize.define(
  "Size",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // Đặt id là khóa chính
      autoIncrement: true,
    },
    sizeName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "size",
    timestamps: false,
  }
);
module.exports = Size;
