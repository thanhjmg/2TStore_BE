const { Employee } = require("../models");

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
};
module.exports = EmployeeController;
