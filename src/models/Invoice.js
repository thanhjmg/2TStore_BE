const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Invoice = sequelize.define(
  "Invoice",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true, // Đặt id là khóa chính
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Paid", "Cancelled"),
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
    },
    shippingAddress: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "invoice",
  }
);
module.exports = Invoice;
