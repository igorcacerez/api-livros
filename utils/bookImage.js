const crypto = require("crypto");
const fs = require("fs/promises");
const path = require("path");
const { uploadDirectory } = require("../config/upload");

function detectImageExtension(buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return ".jpg";
  }

  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return ".png";
  }

  if (buffer.length >= 6) {
    const signature = buffer.subarray(0, 6).toString("ascii");
    if (signature === "GIF87a" || signature === "GIF89a") {
      return ".gif";
    }
  }

  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return ".webp";
  }

  return null;
}

function isValidImageUrl(value) {
  if (typeof value !== "string" || value.trim() === "") {
    return false;
  }

  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (error) {
    return false;
  }
}

async function saveUploadedImage(file) {
  const extension = detectImageExtension(file.buffer);

  if (!extension) {
    const error = new Error("O arquivo enviado nao possui um formato de imagem valido.");
    error.status = 400;
    throw error;
  }

  await fs.mkdir(uploadDirectory, { recursive: true });
  const fileName = `${crypto.randomUUID()}${extension}`;
  await fs.writeFile(path.join(uploadDirectory, fileName), file.buffer, { flag: "wx" });

  return `/uploads/${fileName}`;
}

async function deleteUploadedImage(imagePath) {
  if (typeof imagePath !== "string" || !imagePath.startsWith("/uploads/")) {
    return;
  }

  const fileName = path.basename(imagePath);
  await fs.rm(path.join(uploadDirectory, fileName), { force: true });
}

function resolveImageInput(req) {
  const imageUrl = req.body.imagem_url || req.body.imagem;

  if (req.file) {
    return { type: "upload", file: req.file };
  }

  if (isValidImageUrl(imageUrl)) {
    return { type: "url", value: imageUrl.trim() };
  }

  return null;
}

function publicImageUrl(req, imagePath) {
  if (!imagePath?.startsWith("/uploads/")) {
    return imagePath;
  }

  return `${req.protocol}://${req.get("host")}${imagePath}`;
}

module.exports = {
  deleteUploadedImage,
  publicImageUrl,
  resolveImageInput,
  saveUploadedImage
};
