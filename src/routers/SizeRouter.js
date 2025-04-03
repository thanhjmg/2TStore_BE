const express = require("express");
const router = express.Router();
const sizeController = require("../controllers/SizeController");
const { isEmployee, verifyToken } = require("../controllers/MiddleAuth");

router.post("/addSize", verifyToken, isEmployee, sizeController.addSize);
router.get("/size", verifyToken, isEmployee, sizeController.getSize);

module.exports = router;
