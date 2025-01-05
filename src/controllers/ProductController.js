const { Product, Brand, Size, ProductDetail, Image } = require("../models");

const ProductController = {
  getProductBySlug: async (req, res) => {
    const { slug } = req.params;
    try {
      const productBySlug = await Product.findOne({
        where: { slug },
        include: [
          {
            model: Brand,
          },
          {
            model: ProductDetail,
            include: [
              {
                model: Size,
                // Các thuộc tính của size
              },
            ],
          },
          {
            model: Image,
          },
        ],
      });
      res.status(200).json(productBySlug);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Có lỗi xảy ra khi lấy danh sách sản phẩm" });
    }
  },
  getAllProduct: async (req, res) => {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: Brand,
          },
          {
            model: ProductDetail,
            include: [
              {
                model: Size,
                // Các thuộc tính của size
              },
            ],
          },
          {
            model: Image,
          },
        ],
      });
      res.status(200).json(products);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Có lỗi xảy ra khi lấy danh sách sản phẩm" });
    }
  },
};
module.exports = ProductController;
