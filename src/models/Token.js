const { DataTypes } = require("sequelize");
const sequelize = require("../db"); // Kết nối đến PostgreSQL đã thiết lập

const TokenModel = sequelize.define(
  "Token",
  {
    token: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Đảm bảo token là duy nhất
    },
  },
  {
    timestamps: true, // Thêm createdAt và updatedAt tự động
    tableName: "token",
    indexes: [
      {
        fields: ["token"],
        using: "BTREE", // Có thể sử dụng GIN hoặc GIST tùy vào yêu cầu
      },
    ],
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        delete ret.id; // Xóa trường 'id' khỏi kết quả trả về
      },
    },
  }
);

module.exports = { TokenModel };
