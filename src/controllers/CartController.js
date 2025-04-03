const { Op, Sequelize, literal } = require("sequelize");
const sequelize = require("../db");
const {
  Cart,
  CartItem,
  ProductDetail,
  Size,
  Product,
  Image,
} = require("../models");

const CartController = {
  addProductToCart: async (req, res) => {
    try {
      const { quantity, cartId, productId, sizeId } = req.body;

      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa

      const existingItem = await CartItem.findOne({
        where: { cartId, productId, sizeId },
      });

      if (existingItem) {
        // Nếu sản phẩm đã tồn tại, cập nhật quantity
        existingItem.quantity += quantity;
        await existingItem.save();

        return res.status(200).json({
          message: "Sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng!",
          product: existingItem,
        });
      }

      // Nếu sản phẩm chưa tồn tại, thêm mới vào giỏ hàng
      const newItem = new CartItem({
        quantity,
        cartId,
        productId,
        sizeId,
      });

      await newItem.save();
      res.status(201).json({
        message: "Sản phẩm đã được thêm thành công!",
        product: newItem,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  },

  getCartById: async (req, res) => {
    try {
      const { customerId } = req.params;

      const cart = await Cart.findOne({
        where: { customerId },
        include: [
          {
            model: CartItem,
            as: "CartItems",
            include: [
              {
                model: Product,
                include: [
                  { model: Image },
                  {
                    model: ProductDetail,
                    required: false,
                    where: {
                      sizeId: { [Op.col]: "CartItems.sizeId" }, // Sử dụng Op.col để tham chiếu đến sizeId của CartItem
                    },
                  },
                ],
              },
              {
                model: Size,
              },
            ],
          },
        ],
        order: [["CartItems", "createdAt", "DESC"]],
      });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      res.status(200).json(cart);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },
};

module.exports = CartController;
