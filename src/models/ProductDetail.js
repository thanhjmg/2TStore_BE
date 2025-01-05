const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const ProductDetail = sequelize.define(
  "ProductDetail",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // Đặt id là khóa chính
      autoIncrement: true,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sizeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    purchase_price: {
      type: DataTypes.FLOAT,
      allowNull: null,
    },
    selling_price: {
      type: DataTypes.FLOAT,
      allowNull: null,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "productDetail",
    timestamps: false,
  }
);
module.exports = ProductDetail;
