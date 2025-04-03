const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const OrderDetail = sequelize.define(
  "OrderDetail",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      // allowNull: false,
    },
  },
  { tableName: "order_detail", timestamps: true }
);
module.exports = OrderDetail;
