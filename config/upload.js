const path = require("path");

const uploadDirectory = process.env.UPLOAD_DIR || path.join(__dirname, "..", "uploads");

module.exports = {
  uploadDirectory,
  maxFileSize: 5 * 1024 * 1024
};
