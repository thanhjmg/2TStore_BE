const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Order = sequelize.define(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    total_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Shipping", "Completed", "Cancelled"),
      allowNull: false,
      defaultValue: "Pending",
    },
    paymentMethod: {
      type: DataTypes.ENUM("Online", "Cod"),
    },
    shippingAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    statusPayment: {
      type: DataTypes.ENUM("Paid", "Unpaid"),
      defaultValue: "Unpaid",
    },
  },
  {
    tableName: "order",
    timestamps: true,
  }
);
module.exports = Order;
