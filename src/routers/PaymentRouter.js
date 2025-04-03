const express = require("express");
const router = express.Router();

const PaymentController = require("../controllers/PaymentController");

router.post("/momo", PaymentController.momoPayment);
router.post("/callback", PaymentController.callbackPayment);
router.post("/check_payment", PaymentController.checkPaymentStatus);
module.exports = router;
