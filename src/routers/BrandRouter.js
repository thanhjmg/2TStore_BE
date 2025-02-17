const express = require("express");
const router = express.Router();

const brandController = require("../controllers/BrandController");

router.get("/brand", brandController.getAllBrand);

module.exports = router;
