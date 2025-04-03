const express = require("express");
const router = express.Router();

const { verifyToken, isManager } = require("../controllers/MiddleAuth");

const cartItemController = require("../controllers/CartItemController");

router.get("/cartitem/:cartId", verifyToken, cartItemController.getCartItems);
router.post("/cartitem/add", verifyToken, cartItemController.addToCartItem);
router.delete(
  "/cartitem/:cartItemId",
  verifyToken,
  cartItemController.deleteCartItem
);

router.put(
  "/cartItem/updatequantity",
  verifyToken,
  cartItemController.updateQuantityItem
);

module.exports = router;
