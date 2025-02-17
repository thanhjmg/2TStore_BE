const express = require("express");
const router = express.Router();

const { verifyToken, isManager } = require("../controllers/MiddleAuth");

const productController = require("../controllers/ProductController");

router.get("/products", productController.getAllProduct);
router.get("/productBySlug/:slug", productController.getProductBySlug);
router.get("/productType", productController.getAllTypeProduct);
router.get("/productByBrand/:brand", productController.getProductByBrand);
router.get("/productByType/:type", productController.getProductByType);
module.exports = router;
