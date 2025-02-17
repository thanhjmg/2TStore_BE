const { where } = require("sequelize");
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
      const { quantity, cartId, productDetailId } = req.body;

      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      console.log("pppp", productDetailId);

      const existingItem = await CartItem.findOne({
        where: { cartId, productDetailId },
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
        productDetailId,
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
      const { customerId } = req.params; // Lấy ID từ params của request
      const cart = await Cart.findOne({
        where: { customerId },
        include: {
          model: CartItem,
          include: [
            {
              model: ProductDetail,
              include: [
                {
                  model: Size,
                },
                {
                  model: Product,
                  include: [
                    {
                      model: Image,
                    },
                  ],
                },
              ],
            },
          ],
        },
      });

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }

      res.status(200).json(cart); // Trả về dữ liệu Cart cùng CartItem
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = CartController;
