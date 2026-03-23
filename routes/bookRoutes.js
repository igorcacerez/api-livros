const express = require("express");
const { listBooks, getBookById, createBook, updateBook, deleteBook } = require("../controllers/bookController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/livro", listBooks);
router.get("/livro/:id", getBookById);
router.post("/livro", authMiddleware, createBook);
router.put("/livro/:id", authMiddleware, updateBook);
router.delete("/livro/:id", authMiddleware, deleteBook);

module.exports = router;
