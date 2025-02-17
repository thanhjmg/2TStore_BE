const {
  Product,
  Brand,
  Size,
  ProductDetail,
  Image,

  ProductType,
} = require("../models");

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
  getProductByType: async (req, res) => {
    const { type } = req.params;
    try {
      const productByType = await Product.findAll({
        include: [
          {
            model: Brand,
          },
          {
            model: ProductType,
            where: { slug: type },
          },
          {
            model: ProductDetail,
            include: [
              {
                model: Size,
              },
            ],
          },
          {
            model: Image,
          },
        ],
      });
      res.status(200).json(productByType);
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Có lỗi xảy ra khi lấy danh sách sản phẩm !!!",
          error,
        });
      console.log(error);
    }
  },
  getProductByBrand: async (req, res) => {
    const { brand } = req.params;
    try {
      const productBySlug = await Product.findAll({
        include: [
          {
            model: Brand,
            where: { slug: brand },
          },
          {
            model: ProductDetail,
            include: [
              {
                model: Size,
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
  getAllTypeProduct: async (req, res) => {
    try {
      const producType = await ProductType.findAll();

      res.status(200).json(producType);
    } catch (error) {
      res.status(500).json(error);
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
