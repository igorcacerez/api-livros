const express = require("express");
const { listBooks, createBook } = require("../controllers/bookController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/livro", listBooks);
router.post("/livro", authMiddleware, createBook);

module.exports = router;
