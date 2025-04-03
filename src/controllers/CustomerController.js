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

  updateCustomerById: async (req, res) => {
    const { fullName, phone, address } = req.body;
    try {
      const customer = await Customer.findByPk(req.params.id);
      if (!customer) {
        return res.status(404).json({ message: "Khách hàng không tồn tại." });
      }
      (customer.fullName = fullName),
        (customer.phone = phone),
        (customer.address = address);
      customer.save();
      res.status(200).json(customer);
    } catch (error) {
      console.error("Error fetching customer:", error);
      res.status(500).json({ message: "Lỗi máy chủ, vui lòng thử lại sau." });
    }
  },
};
module.exports = CustomerController;
