const express = require("express");
const router = express.Router();

const { verifyToken, isEmployee } = require("../controllers/MiddleAuth");

const productController = require("../controllers/ProductController");
const { uploadImage, upload } = require("../controllers/UploadController");

router.get("/productBySlug/:slug", productController.getProductBySlug);
router.get("/productType", productController.getAllTypeProduct);
router.get("/products", productController.getAllProduct);
router.get("/products/search/:keyword", productController.searchProducts);
router.get("/productByBrand/:brand", productController.getProductByBrand);
router.get("/productByType/:type", productController.getProductByType);
router.get("/productDetailById/:id", productController.getProductDetailById);
router.get("/productLatest", productController.getLatestProduct);
router.get("/products/:id", productController.getProductById);
router.post(
  "/addProduct",
  verifyToken,
  isEmployee,
  productController.addProduct
);
router.post(
  "/addProductType",
  verifyToken,
  isEmployee,
  productController.addProductType
);
router.put(
  "/updateProduct/:id",
  verifyToken,
  isEmployee,
  productController.updateProduct
);

router.put(
  "/updateQuantity",
  verifyToken,
  isEmployee,
  productController.updateQuantity
);
router.post(
  "/addProductDetail",
  verifyToken,
  isEmployee,
  productController.addProductDetail
);
router.get(
  "/best-selling",
  verifyToken,
  isEmployee,
  productController.getBestSellingProducts
);
router.get(
  "/low-stock-sizes",
  verifyToken,
  isEmployee,
  productController.getLowStockSizes
);
module.exports = router;
