const { Customer } = require("../models");

const CustomerController = {
  getCustomerById: async (req, res) => {
    try {
      const customer = await Customer.findByPk(req.params.id);
      if (!customer) {
        return res.status(404).json({ message: "Khách hàng không tồn tại." });
      }

      res.status(200).json(customer); // Trả về thông tin khách hàng
    } catch (error) {
      console.error("Error fetching customer:", error);
      res.status(500).json({ message: "Lỗi máy chủ, vui lòng thử lại sau." });
    }
  },
};
module.exports = CustomerController;
