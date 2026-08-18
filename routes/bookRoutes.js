const express = require("express");
const { listBooks, getBookById, createBook, updateBook, deleteBook } = require("../controllers/bookController");
const authMiddleware = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get(["/livros", "/livro"], listBooks);
router.get(["/livros/:id", "/livro/:id"], authMiddleware, getBookById);
router.post(["/livros", "/livro"], authMiddleware, uploadMiddleware.single("imagem"), createBook);
router.put(["/livros/:id", "/livro/:id"], authMiddleware, uploadMiddleware.single("imagem"), updateBook);
router.delete(["/livros/:id", "/livro/:id"], authMiddleware, deleteBook);

module.exports = router;
