const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "db9qwbgkj",
  api_key: "773235899175813",
  api_secret: "AGiPR9b0nWyVAQ1NwGJIZ3RCqlc",
});

module.exports = cloudinary;
