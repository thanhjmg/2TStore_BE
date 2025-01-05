const express = require("express");
const router = express.Router();

const { verifyToken, isManager } = require("../controllers/MiddleAuth");

const productController = require("../controllers/ProductController");

router.get("/products", productController.getAllProduct);
router.get("/productBySlug/:slug", productController.getProductBySlug);
module.exports = router;
