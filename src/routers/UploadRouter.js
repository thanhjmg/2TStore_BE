const express = require("express");
const { uploadImage, upload } = require("../controllers/UploadController");

const router = express.Router();

// API upload ảnh
router.post("/upload", upload.array("images", 10), uploadImage);

module.exports = router;
