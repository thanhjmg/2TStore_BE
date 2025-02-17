const { Brand } = require("../models");

const BrandController = {
  getAllBrand: async (req, res) => {
    try {
      const brands = await Brand.findAll();
      res.status(200).json(brands);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
module.exports = BrandController;
