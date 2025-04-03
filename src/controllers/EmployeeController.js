const { Employee, User } = require("../models");
const sequelize = require("../db");
const bcrypt = require("bcrypt");

const EmployeeController = {
  getEmployees: async (req, res) => {
    try {
      const employees = await Employee.findAll();
      res.status(200).json(employees);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Có lỗi xảy ra khi lấy danh sách nhân viên" });
    }
  },

  getEmployeeById: async (req, res) => {
    const { id } = req.params;
    try {
      const employees = await Employee.findByPk(id);
      res.status(200).json(employees);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Có lỗi xảy ra khi lấy danh sách nhân viên" });
    }
  },

  updateEmployeeById: async (req, res) => {
    const { id } = req.params;
    const { fullName, position, phone, CCCD, address } = req.body;

    try {
      // Tìm nhân viên theo ID
      const employeeById = await Employee.findByPk(id);
      if (!employeeById) {
        return res.status(404).json({ message: "Không tìm thấy nhân viên" });
      }

      // Tìm User theo userId của nhân viên
      const user = await User.findByPk(employeeById.userId);
      if (!user) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy tài khoản của nhân viên" });
      }

      // Cập nhật thông tin nhân viên
      employeeById.fullName = fullName;
      employeeById.position = position;
      employeeById.phone = phone;
      employeeById.CCCD = CCCD;
      employeeById.address = address;
      await employeeById.save(); // Lưu thay đổi

      // Cập nhật role trong bảng User dựa trên position
      user.role = position;
      await user.save(); // Lưu thay đổi

      res
        .status(200)
        .json({ message: "Cập nhật thành công", employeeById, user });
    } catch (error) {
      console.error("Lỗi khi cập nhật nhân viên:", error);
      res
        .status(500)
        .json({ message: "Có lỗi xảy ra khi cập nhật nhân viên", error });
    }
  },

  // Import Sequelize instance

  addEmployee: async (req, res) => {
    const { email, fullName, position, phone, CCCD, address } = req.body;
    const password = "1234";

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const transaction = await sequelize.transaction(); // Bắt đầu transaction

    try {
      const existingUser = await User.findOne({ where: { username: email } });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Email đã tồn tại, vui lòng chọn email khác!" });
      }

      const newUser = await User.create(
        { username: email, password: hashPass, role: position },
        { transaction }
      );

      const newEmployee = await Employee.create(
        { email, fullName, userId: newUser.id, position, phone, CCCD, address },
        { transaction }
      );

      await transaction.commit(); // Nếu mọi thứ OK, commit transaction

      return res
        .status(200)
        .json({ message: "Thêm nhân viên thành công", newEmployee });
    } catch (error) {
      await transaction.rollback(); // Nếu lỗi, rollback
      return res
        .status(500)
        .json({ message: "Có lỗi xảy ra khi thêm nhân viên", error });
    }
  },
};
module.exports = EmployeeController;
