const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Product = sequelize.define(
  "Product",
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
    description: {
      type: DataTypes.TEXT,
    },
    purchase_price: {
      type: DataTypes.FLOAT,
      // allowNull: null,
    },
    selling_price: {
      type: DataTypes.FLOAT,
      // allowNull: null,
    },

    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true, // Tự động thêm `createdAt` và `updatedAt`
    tableName: "product",
  }
);
module.exports = Product;
