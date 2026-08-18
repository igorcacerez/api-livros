const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser
} = require("../controllers/userController");

const router = express.Router();

router.post(["/usuarios", "/cadastro"], createUser);
router.get("/usuarios", authMiddleware, listUsers);
router.get("/usuarios/:id", authMiddleware, getUserById);
router.put("/usuarios/:id", authMiddleware, updateUser);
router.delete("/usuarios/:id", authMiddleware, deleteUser);

module.exports = router;
