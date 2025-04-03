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
  addBrand: async (req, res) => {
    const { brand } = req.body;
    const slug = brand
      .toLowerCase()
      .normalize("NFD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    try {
      const newBrand = new Brand({
        name: brand,
        slug: slug,
      });
      await newBrand.save();
      res.status(200).json(newBrand);
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = BrandController;
