const express = require("express");
const { listBooks, getBookById, createBook, updateBook } = require("../controllers/bookController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/livro", listBooks);
router.get("/livro/:id", getBookById);
router.post("/livro", authMiddleware, createBook);
router.put("/livro/:id", authMiddleware, updateBook);

module.exports = router;
