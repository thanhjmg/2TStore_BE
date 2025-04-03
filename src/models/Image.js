const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Image = sequelize.define(
  "Image",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // Đặt id là khóa chính
      autoIncrement: true,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: "image",
    timestamps: false,
  }
);
module.exports = Image;
