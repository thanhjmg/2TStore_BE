const express = require("express");
const router = express.Router();

const brandController = require("../controllers/BrandController");
const { verifyToken, isEmployee } = require("../controllers/MiddleAuth");

router.get("/brand", brandController.getAllBrand);
router.post("/addBrand", verifyToken, isEmployee, brandController.addBrand);
module.exports = router;
