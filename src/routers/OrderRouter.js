const express = require("express");

const router = express.Router();
const {
  verifyToken,
  isEmployee,
  isCustomer,
  isManager,
} = require("../controllers/MiddleAuth");
const orderController = require("../controllers/OrderController");

router.post("/order/add", verifyToken, isCustomer, orderController.addOrder);
router.get(
  "/orderCustomerById",
  verifyToken,
  isCustomer,
  orderController.getOrderByCustomerId
);
router.delete(
  "/deleteOrder/:id",
  verifyToken,
  isCustomer,
  orderController.deleteOrder
);
router.get(
  "/orderStatus/:status",
  verifyToken,
  isEmployee,
  orderController.getOrderByStatus
);
router.get(
  "/orderById/:id",
  verifyToken,
  isEmployee,
  orderController.getOrderById
);

router.get(
  "/orderByDate/:startDate/:endDate",
  verifyToken,
  isEmployee,
  orderController.getOrderByDate
);

router.put(
  "/updateStatusOrder/:id",
  verifyToken,
  isEmployee,
  orderController.updateStatus
);

module.exports = router;
