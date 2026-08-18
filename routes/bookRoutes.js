const express = require("express");
const { listBooks, getBookById, createBook, updateBook, deleteBook } = require("../controllers/bookController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get(["/livros", "/livro"], listBooks);
router.get(["/livros/:id", "/livro/:id"], authMiddleware, getBookById);
router.post(["/livros", "/livro"], authMiddleware, createBook);
router.put(["/livros/:id", "/livro/:id"], authMiddleware, updateBook);
router.delete(["/livros/:id", "/livro/:id"], authMiddleware, deleteBook);

module.exports = router;
