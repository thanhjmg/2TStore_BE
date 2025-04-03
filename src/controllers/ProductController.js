const {
  Product,
  Brand,
  Size,
  ProductDetail,
  Image,

  ProductType,
  OrderDetail,
} = require("../models");
const sequelize = require("../db");
const { Op } = require("sequelize");
const { uploadImage } = require("./UploadController");
const cloudinary = require("../cloudinary");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array("images", 10);
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    stream.end(file.buffer); // Gửi buffer của file vào stream
  });
};

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
    try {
      const { type } = req.params;
      const { sort_by } = req.query;
      const page = parseInt(req.query.page);
      const limit = 20; // 🔹 Số sản phẩm trên mỗi trang
      const offset = (page - 1) * limit;
      let orderCondition = [];

      // Xử lý sắp xếp theo giá
      if (sort_by === "price-ascending") {
        orderCondition.push(["selling_price", "ASC"]); // 🔹 Giá tăng dần
      } else if (sort_by === "price-descending") {
        orderCondition.push(["selling_price", "DESC"]); // 🔹 Giá giảm dần
      }
      const { count, rows } = await Product.findAndCountAll({
        distinct: true,
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
        order: orderCondition.length > 0 ? orderCondition : undefined,
        limit,
        offset,
      });

      const totalPages = Math.ceil(count / limit); // ✅ Dùng `count` lấy từ `findAndCountAll`

      res.status(200).json({
        products: rows,
        currentPage: page,
        totalPages, // 🔹 Gửi tổng số trang về frontend
        totalProducts: count, // ✅ Sửa `totalProducts` lấy từ `count`
      });
    } catch (error) {
      res.status(500).json({
        message: "Có lỗi xảy ra khi lấy danh sách sản phẩm !!!",
        error,
      });
      console.log(error);
    }
  },
  getProductByBrand: async (req, res) => {
    try {
      const { sort_by } = req.query;
      const { brand } = req.params;
      const page = parseInt(req.query.page);
      const limit = 20; // 🔹 Số sản phẩm trên mỗi trang
      const offset = (page - 1) * limit;
      let orderCondition = [];

      // Xử lý sắp xếp theo giá
      if (sort_by === "price-ascending") {
        orderCondition.push(["selling_price", "ASC"]); // 🔹 Giá tăng dần
      } else if (sort_by === "price-descending") {
        orderCondition.push(["selling_price", "DESC"]); // 🔹 Giá giảm dần
      }
      const { count, rows } = await Product.findAndCountAll({
        distinct: true,
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
        order: orderCondition.length > 0 ? orderCondition : undefined,
        limit,
        offset,
      });

      const totalPages = Math.ceil(count / limit); // ✅ Dùng `count` lấy từ `findAndCountAll`

      res.status(200).json({
        products: rows,
        currentPage: page,
        totalPages, // 🔹 Gửi tổng số trang về frontend
        totalProducts: count, // ✅ Sửa `totalProducts` lấy từ `count`
      });
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

  getLatestProduct: async (req, res) => {
    try {
      let orderCondition = [];

      orderCondition.push(["createdAt", "DESC"]);

      const products = await Product.findAll({
        include: [
          { model: Brand },
          {
            model: ProductDetail,
            include: [{ model: Size }],
          },
          { model: Image },
        ],
        order: orderCondition,
        limit: 10, // 🔹 Lấy 10 sản phẩm mới nhất
      });

      res.status(200).json(products);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      res.status(500).json({
        message: "Có lỗi xảy ra khi lấy danh sách sản phẩm",
        error,
      });
    }
  },

  getProductById: async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.findOne({
        where: { id: id },
        include: [
          { model: Brand },
          {
            model: ProductDetail,
            include: [{ model: Size }],
          },
          { model: ProductType },
          { model: Image },
        ],
      });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(product);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Interval Server Erorr", error: error.message });
    }
  },
  getAllProduct: async (req, res) => {
    try {
      const { sort_by } = req.query;
      const page = parseInt(req.query.page) || 1; // 🔹 Trang mặc định là 1
      const limit = 20; // 🔹 Số sản phẩm trên mỗi trang
      const offset = (page - 1) * limit;

      let orderCondition = [];
      if (sort_by === "price-ascending") {
        orderCondition.push(["selling_price", "ASC"]);
      } else if (sort_by === "price-descending") {
        orderCondition.push(["selling_price", "DESC"]);
      }

      // 🔹 Lấy tổng số sản phẩm & danh sách sản phẩm theo trang
      const { count, rows } = await Product.findAndCountAll({
        distinct: true, // ✅ Tránh đếm trùng sản phẩm do JOIN
        include: [
          { model: Brand },
          {
            model: ProductDetail,
            include: [{ model: Size }],
          },
          { model: Image },
        ],
        order: orderCondition.length > 0 ? orderCondition : undefined,
        limit,
        offset,
      });

      const totalPages = Math.ceil(count / limit); // ✅ Dùng `count` lấy từ `findAndCountAll`

      res.status(200).json({
        products: rows,
        currentPage: page,
        totalPages, // 🔹 Gửi tổng số trang về frontend
        totalProducts: count, // ✅ Sửa `totalProducts` lấy từ `count`
      });
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      res.status(500).json({
        message: "Có lỗi xảy ra khi lấy danh sách sản phẩm",
        error,
      });
    }
  },

  getProductDetailById: async (req, res) => {
    try {
      const { id } = req.params;
      const productById = await ProductDetail.findOne({
        where: { id: id },
        include: [
          { model: Product, include: [{ model: Image }] },
          { model: Size },
        ],
      });
      res.status(200).json(productById);
    } catch (error) {
      res.status(401).json(error);
    }
  },
  searchProducts: async (req, res) => {
    try {
      const { sort_by } = req.query;
      const { keyword } = req.params;
      // 🔹 Nhận tham số sort từ URL
      let orderCondition = [];

      // Xử lý sắp xếp theo giá
      if (sort_by === "price-ascending") {
        orderCondition.push(["selling_price", "ASC"]); // 🔹 Giá tăng dần
      } else if (sort_by === "price-descending") {
        orderCondition.push(["selling_price", "DESC"]); // 🔹 Giá giảm dần
      }

      const products = await Product.findAll({
        where: {
          name: {
            [Op.iLike]: `%${keyword}%`, // Tìm tên có chứa từ khóa (không phân biệt hoa thường)
          },
        },
        include: [
          { model: Brand },
          {
            model: ProductDetail,
            include: [{ model: Size }],
          },
          { model: Image },
        ],
        order: orderCondition.length > 0 ? orderCondition : undefined, // 🔹 Áp dụng sắp xếp nếu có
      });

      res.status(200).json(products);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      res
        .status(500)
        .json({ message: "Có lỗi xảy ra khi lấy danh sách sản phẩm", error });
    }
  },
  updateProduct: async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: "Lỗi upload file!" });
      }
      const { id } = req.params;
      const transaction = await sequelize.transaction(); // Bắt đầu transaction
      console.log("id", id);

      try {
        const {
          name,
          productTypeId,
          brandId,
          selling_price,
          purchase_price,
          description,
          slug,
        } = req.body;
        const images = req.files;

        const uploadPromises = images.map((img) => uploadToCloudinary(img));
        const imageUrls = await Promise.all(uploadPromises);

        const existingProduct = await Product.findByPk(id);
        if (!existingProduct) {
          return res.status(404).json({ error: "Sản phẩm không tông tại" });
        }
        await existingProduct.update(
          {
            name,
            productTypeId,
            brandId,
            selling_price,
            purchase_price,
            description,
            slug,
          },
          { transaction }
        );
        // Lưu từng ảnh vào bảng Image
        for (let url of imageUrls) {
          await Image.create(
            {
              productId: id, // Liên kết với sản phẩm vừa tạo
              url: url,
            },
            { transaction }
          );
        }

        // Nếu thành công, commit transaction
        await transaction.commit();

        // Trả kết quả về client
        res.status(200).json({
          message: "Update sản phẩm thành công!",
          product: existingProduct,
          images: imageUrls,
        });
      } catch (error) {
        await transaction.rollback(); // Rollback khi có lỗi
        console.error(error);
        res.status(500).json({ error: "Lỗi server!" });
      }
    });
  },

  addProduct: async (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: "Lỗi upload file!" });
      }

      const transaction = await sequelize.transaction(); // Bắt đầu transaction

      try {
        const {
          name,
          productTypeId,
          brandId,
          selling_price,
          purchase_price,
          description,
          slug,
        } = req.body;
        const images = req.files;

        if (!name || !images || images.length === 0) {
          return res.status(400).json({ error: "Thiếu dữ liệu đầu vào!" });
        }

        // Upload tất cả ảnh lên Cloudinary
        const uploadPromises = images.map((img) => uploadToCloudinary(img));
        const imageUrls = await Promise.all(uploadPromises);

        // Thêm sản phẩm mới
        const newPro = await Product.create(
          {
            name,
            productTypeId,
            brandId,
            selling_price,
            purchase_price,
            description,
            slug,
          },
          { transaction }
        );

        // Lưu từng ảnh vào bảng Image
        for (let url of imageUrls) {
          await Image.create(
            {
              productId: newPro.id, // Liên kết với sản phẩm vừa tạo
              url: url,
            },
            { transaction }
          );
        }

        // Nếu thành công, commit transaction
        await transaction.commit();

        // Trả kết quả về client
        res.status(200).json({
          message: "Thêm sản phẩm thành công!",
          product: newPro,
          images: imageUrls,
        });
      } catch (error) {
        await transaction.rollback(); // Rollback khi có lỗi
        console.error(error);
        res.status(500).json({ error: "Lỗi server!" });
      }
    });
  },

  addProductDetail: async (req, res) => {
    const { sizeId, productId, quantity } = req.body;

    try {
      const getProductDetail = await ProductDetail.findOne({
        where: { sizeId: sizeId, productId: productId },
      });
      if (getProductDetail) {
        getProductDetail.quantity += Number(quantity);
        await getProductDetail.save();
        res
          .status(200)
          .json({ message: "Thêm thành công!!", data: getProductDetail });
        return;
      }
      const idProductDetail = (await ProductDetail.max("id")) || 0;
      const newproductDetail = new ProductDetail({
        id: idProductDetail + 1,
        sizeId,
        productId,
        quantity,
      });

      await newproductDetail.save();
      res
        .status(200)
        .json({ message: "Thêm thành công!!", data: newproductDetail });
    } catch (error) {
      res.status(500).json(error);
    }
  },
  updateQuantity: async (req, res) => {
    const { id, quantity } = req.body;
    console.log("id:", id, quantity);

    try {
      const productDetailById = await ProductDetail.findByPk(id);

      if (!productDetailById) {
        return res.status(404).json({ error: "Size không tồn tại!" });
      }

      productDetailById.quantity = quantity;
      await productDetailById.save();

      return res.status(200).json({
        message: "Cập nhật số lượng thành công!",
        productDetailById: productDetailById,
      });
    } catch (error) {
      console.error("Lỗi cập nhật size:", error);
      return res.status(500).json({ error: "Lỗi server!" });
    }
  },
  addProductType: async (req, res) => {
    const { productType } = req.body;
    const slug = productType
      .toLowerCase()
      .normalize("NFD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    try {
      const newProType = new ProductType({
        name: productType,
        slug: slug,
      });
      await newProType.save();
      res.status(200).json(newProType);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getBestSellingProducts: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10; // Giới hạn số sản phẩm trả về

      const bestSellingProducts = await Product.findAll({
        attributes: {
          include: [
            [
              sequelize.fn("SUM", sequelize.col("OrderDetails.quantity")),
              "total_sold",
            ],
          ],
        },
        include: [
          {
            model: OrderDetail,
            as: "OrderDetails", // Đảm bảo alias trùng với trong model
            attributes: [],
          },
        ],
        group: ["Product.id"],
        order: [[sequelize.literal("total_sold"), "DESC"]],
        limit: limit,
        subQuery: false, // Tránh lỗi nhóm khi dùng include
      });

      return res.status(200).json(bestSellingProducts);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm bán chạy:", error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  },
  getLowStockSizes: async (req, res) => {
    try {
      const lowStockSizes = await ProductDetail.findAll({
        where: {
          quantity: { [Op.lt]: 10 }, // Lọc size có số lượng < 10
        },

        include: [
          {
            model: Product,
            // Lấy ID & tên sản phẩm
          },
          {
            model: Size,
            // Lấy ID & giá trị size
          },
        ],
        order: [["quantity", "ASC"]], // Sắp xếp size gần hết hàng trước
      });

      return res.status(200).json(lowStockSizes);
    } catch (error) {
      console.error("Lỗi khi lấy size sắp hết hàng:", error);
      return res.status(500).json({ message: "Lỗi server" });
    }
  },
};
module.exports = ProductController;
