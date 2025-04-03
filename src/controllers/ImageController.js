const { image } = require("../cloudinary");
const { Image } = require("../models");
const cloudinary = require("../cloudinary");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array("images", 10);
const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );
    stream.end(file.buffer); // Gửi buffer của file vào stream
  });
};

const ImageController = {
  getImageByType: async (req, res) => {
    try {
      const { type } = req.params;
      const getImgByType = await Image.findAll({
        where: { type: type },
      });
      res.status(200).json(getImgByType);
    } catch (error) {
      res.status(401).json(error);
    }
  },
  deleteImgById: async (req, res) => {
    try {
      const { id } = req.params;

      // Tìm ảnh theo ID
      const imgById = await Image.findByPk(id);
      if (!imgById) {
        return res.status(404).json({ error: "Ảnh không tồn tại!" });
      }

      // 🔥 Nếu có lưu trên Cloudinary, xóa luôn
      const imageUrl = imgById.url;
      const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0]; // Lấy public_id từ URL

      // Xóa ảnh trên Cloudinary
      await cloudinary.uploader.destroy(publicId);

      // Xóa ảnh trong database
      await imgById.destroy();

      return res.status(200).json({ message: "Xóa ảnh thành công!" });
    } catch (error) {
      console.error("Lỗi xóa ảnh:", error);
      return res.status(500).json({ error: "Lỗi server!" });
    }
  },
};
module.exports = ImageController;
