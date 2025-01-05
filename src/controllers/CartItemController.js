const { CartItem, Product, Size, Brand, Cart } = require("../models");

const CartItemController = {
  addToCartItem: async (req, res) => {
    try {
      const { userId, productId, quantity, sizeId } = req.body;

      const cart = await Cart.findOne({
        where: { userId },
      });
      console.log("Cart:", cart.id);
      const cartId = cart.id;

      // Kiểm tra đầu vào
      if (!userId || !productId || !quantity || !sizeId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
      const existingCartItem = await CartItem.findOne({
        where: { cartId, productId, sizeId },
      });

      if (existingCartItem) {
        // Nếu đã tồn tại, cập nhật số lượng
        existingCartItem.quantity += quantity;
        await existingCartItem.save();
      } else {
        // Nếu chưa tồn tại, thêm sản phẩm mới
        await CartItem.create({ cartId, productId, quantity, sizeId });
      }

      return res
        .status(200)
        .json({ message: "Product added to cart successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Error adding product to cart",
        error: error.message,
      });
    }
  },

  getCartItems: async (req, res) => {
    try {
      const cartItems = await CartItem.findAll({
        where: { cartId: req.params.cartId }, // Lấy giỏ hàng theo ID người dùng
        include: [
          {
            model: Product,

            include: [{ model: Brand }],
          },
          {
            model: Size,
          },
        ],
      });

      res.status(200).json(cartItems);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({
        message: "Có lỗi xảy ra khi lấy giỏ hàng",
        error: error.message,
      });
    }
  },
};
module.exports = CartItemController;
