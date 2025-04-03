const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "postgres",
    pool: {
      max: 10, // Tăng số kết nối tối đa
      min: 0,
      acquire: 60000, // Tăng thời gian chờ (mặc định 10000ms = 10s)
      idle: 10000,
    },
  }
);

module.exports = sequelize;
