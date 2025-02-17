const express = require("express");
const router = express.Router();

const { verifyToken, isManager } = require("../controllers/MiddleAuth");

const cartController = require("../controllers/CartController");

router.get("/cart/:customerId", verifyToken, cartController.getCartById);
router.post(
  "/cart/addProduct",

  verifyToken,
  cartController.addProductToCart
);

module.exports = router;
