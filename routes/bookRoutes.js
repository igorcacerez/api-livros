const express = require("express");
const { listBooks, getBookById, createBook } = require("../controllers/bookController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/livro", listBooks);
router.get("/livro/:id", getBookById);
router.post("/livro", authMiddleware, createBook);

module.exports = router;
