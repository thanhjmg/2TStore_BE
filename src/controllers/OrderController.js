const {
  Order,
  Product,
  OrderDetail,
  ProductDetail,
  Size,
  Image,
  Customer,
} = require("../models");
const { Op } = require("sequelize");
const sequelize = require("../db");

const OrderController = {
  addOrder: async (req, res) => {
    const t = await sequelize.transaction(); // Bắt đầu transaction
    try {
      const {
        customerId,
        shippingAddress,
        paymentMethod,
        total_price,
        status,
        items,
      } = req.body;

      // 1️⃣ Kiểm tra tất cả sản phẩm trước khi tạo đơn hàng
      for (const item of items) {
        const productDetail = await ProductDetail.findOne({
          where: { productId: item.productId, sizeId: item.sizeId },
          transaction: t, // Thêm transaction vào đây
        });

        if (!productDetail) {
          await t.rollback(); // Rollback nếu có lỗi
          return res.status(400).json({
            message: `❌ Sản phẩm ID ${item.productId} không tồn tại!`,
          });
        }

        if (productDetail.quantity < item.quantityBuy) {
          await t.rollback(); // Rollback nếu hết hàng
          return res.status(400).json({
            message: `❌ Sản phẩm ID ${item.productId} không đủ hàng! Chỉ còn ${productDetail.quantity} sản phẩm.`,
          });
        }
      }

      // 2️⃣ Nếu tất cả sản phẩm đều còn hàng, tiến hành tạo order
      const newOrder = await Order.create(
        {
          customerId,
          shippingAddress,
          paymentMethod,
          total_price,
          status,
        },
        { transaction: t } // Thêm transaction vào đây
      );

      // 3️⃣ Thêm từng sản phẩm vào OrderDetail và cập nhật số lượng
      for (const item of items) {
        const productDetail = await ProductDetail.findOne({
          where: { productId: item.productId, sizeId: item.sizeId },
          transaction: t,
        });

        await OrderDetail.create(
          {
            orderId: newOrder.id,
            productId: item.productId,
            sizeId: item.sizeId,
            quantity: item.quantityBuy,
            price: item.Product.selling_price,
          },
          { transaction: t } // Thêm transaction vào đây
        );

        // Cập nhật lại số lượng sản phẩm trong kho
        productDetail.quantity -= item.quantityBuy;
        await productDetail.save({ transaction: t }); // Thêm transaction vào đây
      }

      // 4️⃣ Commit transaction nếu tất cả đều thành công
      await t.commit();
      res.status(200).json({
        message: "✅ Đơn hàng đã được tạo thành công!",
        data: newOrder,
      });
    } catch (error) {
      await t.rollback(); // Rollback nếu có lỗi
      res.status(500).json({ message: "❌ Lỗi server", error: error.message });
    }
  },

  getOrderByCustomerId: async (req, res) => {
    try {
      const { customerId, status } = req.query;
      console.log(customerId, status);

      const getOrder = await Order.findAll({
        where: { customerId: customerId, status: status },
        include: [
          {
            model: OrderDetail,
            include: [
              { model: Size },
              { model: Product, include: [{ model: Image }] },
            ],
          },
        ],
      });
      res.status(200).json(getOrder);
    } catch (error) {
      res.status(400).json(error);
      console.log(error);
    }
  },

  getOrderByStatus: async (req, res) => {
    try {
      const { status } = req.params;
      console.log(status);

      const orderStatus = await Order.findAll({
        where: {
          status: status,
          [Op.or]: [
            { paymentMethod: "Online", statusPayment: "Paid" },
            { paymentMethod: "Cod" },
          ],
        },
        include: [
          {
            model: OrderDetail,
            include: [{ model: Size }, { model: Product }],
          },
        ],
      });
      res.status(200).json(orderStatus);
    } catch (error) {
      console.log(error);

      res.status(500).json(error);
    }
  },

  getOrderById: async (req, res) => {
    try {
      const { id } = req.params;

      const orderStatus = await Order.findOne({
        where: {
          id: id,
        },
        include: [
          {
            model: OrderDetail,

            include: [{ model: Size }, { model: Product }],
          },
          { model: Customer },
        ],
      });
      res.status(200).json(orderStatus);
    } catch (error) {
      console.log(error);

      res.status(500).json(error);
    }
  },
  updateStatus: async (req, res) => {
    const { id } = req.params;
    const { status, statusPayment } = req.body;

    try {
      const getOrder = await Order.findByPk(id);
      if (getOrder) {
        getOrder.status = status;
        getOrder.statusPayment = statusPayment;
        getOrder.save();

        res.status(200).json(getOrder);
      }
    } catch (error) {
      res.satus(500).json(error);
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const { id } = req.params;

      const orderDetails = await OrderDetail.findAll({
        where: { orderId: id },
      });
      for (const item of orderDetails) {
        await ProductDetail.increment(
          { quantity: item.quantity }, // Cộng lại số lượng
          { where: { productId: item.productId, sizeId: item.sizeId } } // Tìm đúng sản phẩm cần cập nhật
        );
      }

      // Xóa tất cả OrderDetail có OrderId = id
      await OrderDetail.destroy({ where: { orderId: id } });

      // Xóa luôn Order nếu cần
      await Order.destroy({ where: { id } });

      return res.status(200).json({ message: "Xóa đơn hàng thành công!" });
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
      return res.status(500).json({ message: "Lỗi server!" });
    }
  },
  getOrderByDate: async (req, res) => {
    const { startDate, endDate } = req.params;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Vui lòng chọn khoảng thời gian" });
    }

    try {
      const orders = await Order.findAll({
        where: {
          createdAt: {
            [Op.between]: [startDate, endDate], // Lọc khoảng thời gian
          },
          status: "Completed",
        },
        include: [
          {
            model: OrderDetail,
            include: [{ model: Size }, { model: Product }],
          },
        ],
        order: [["createdAt", "DESC"]], // Sắp xếp từ mới nhất đến cũ nhất
      });

      res.json(orders);
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  },
};
module.exports = OrderController;
