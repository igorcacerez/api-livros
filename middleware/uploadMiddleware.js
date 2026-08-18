const multer = require("multer");
const uploadConfig = require("../config/upload");

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp"
]);

const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: uploadConfig.maxFileSize,
    files: 1
  },
  fileFilter(req, file, callback) {
    if (!allowedMimeTypes.has(file.mimetype)) {
      const error = new Error("Formato de imagem invalido. Use JPEG, PNG, GIF ou WebP.");
      error.status = 400;
      callback(error);
      return;
    }

    callback(null, true);
  }
});

module.exports = uploadMiddleware;
