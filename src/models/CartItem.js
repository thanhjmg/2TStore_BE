const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Product = require("./Product");
const Cart = require("./Cart");

const CartItem = sequelize.define(
  "CartItem",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // Đặt id là khóa chính
      autoIncrement: true,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "cartItem",
  }
);
module.exports = CartItem;
