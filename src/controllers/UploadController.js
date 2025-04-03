const pool = require("../db");
const cloudinary = require("../cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Cấu hình Multer để lưu ảnh trên Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",
    format: async (req, file) => "png",
    public_id: (req, file) => file.originalname.split(".")[0],
  },
});

const upload = multer({ storage: storage });

// Hàm upload ảnh
const uploadImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Vui lòng chọn file ảnh!" });
    }

    // Lấy danh sách URL ảnh từ Cloudinary
    const imageUrls = req.files.map((file) => file.path);

    res.json({ success: true, imageUrls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Lỗi khi upload ảnh" });
  }
};

module.exports = { upload, uploadImage };
