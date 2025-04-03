const express = require("express");
const router = express.Router();

const imageController = require("../controllers/ImageController");
const { isEmployee, verifyToken } = require("../controllers/MiddleAuth");

router.get("/image/:type", imageController.getImageByType);
router.delete(
  "/deleteImgId/:id",
  verifyToken,
  isEmployee,
  imageController.deleteImgById
);
module.exports = router;
