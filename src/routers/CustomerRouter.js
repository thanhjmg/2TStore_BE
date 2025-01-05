const express = require("express");

const router = express.Router();
const {
  verifyToken,
  isManager,
  isCustomer,
} = require("../controllers/MiddleAuth");

const customerController = require("../controllers/CustomerController");

router.get(
  "/customer/:id",
  verifyToken,
  isCustomer,
  customerController.getCustomerById
);

module.exports = router;
