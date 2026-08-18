const bcrypt = require("bcryptjs");
const { all, get, run } = require("../database/connection");
const { register } = require("./authController");
const { validateFieldsForProfanity } = require("../utils/contentModeration");

function parseId(value) {
  const id = Number.parseInt(value, 10);
  return Number.isNaN(id) || id <= 0 ? null : id;
}

function hasEmptyValue(value) {
  return typeof value !== "string" || value.trim() === "";
}

async function listUsers(req, res, next) {
  try {
    const users = await all(
      "SELECT id, nome, email FROM usuarios ORDER BY id ASC"
    );

    return res.status(200).json({
      total: users.length,
      usuarios: users
    });
  } catch (error) {
    return next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const userId = parseId(req.params.id);

    if (!userId) {
      return res.status(400).json({
        mensagem: "O ID do usuario deve ser um numero inteiro maior que zero."
      });
    }

    const user = await get(
      "SELECT id, nome, email FROM usuarios WHERE id = ?",
      [userId]
    );

    if (!user) {
      return res.status(404).json({ mensagem: "Usuario nao encontrado." });
    }

    return res.status(200).json({ usuario: user });
  } catch (error) {
    return next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const userId = parseId(req.params.id);
    const { nome, email, senha } = req.body;

    if (!userId) {
      return res.status(400).json({
        mensagem: "O ID do usuario deve ser um numero inteiro maior que zero."
      });
    }

    if (hasEmptyValue(nome) || hasEmptyValue(email) || hasEmptyValue(senha)) {
      return res.status(400).json({
        mensagem: "Os campos nome, email e senha sao obrigatorios."
      });
    }

    const profanityValidation = validateFieldsForProfanity({ nome, email });

    if (profanityValidation) {
      return res.status(400).json({
        mensagem: `O campo ${profanityValidation.field} contem linguagem impropria e nao pode ser salvo.`
      });
    }

    const existingUser = await get("SELECT id FROM usuarios WHERE id = ?", [userId]);

    if (!existingUser) {
      return res.status(404).json({ mensagem: "Usuario nao encontrado." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const duplicateEmail = await get(
      "SELECT id FROM usuarios WHERE email = ? AND id <> ?",
      [normalizedEmail, userId]
    );

    if (duplicateEmail) {
      return res.status(409).json({
        mensagem: "Ja existe um usuario cadastrado com este email."
      });
    }

    const passwordHash = await bcrypt.hash(senha, 10);
    await run(
      "UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?",
      [nome.trim(), normalizedEmail, passwordHash, userId]
    );

    return res.status(200).json({
      mensagem: "Usuario atualizado com sucesso.",
      usuario: {
        id: userId,
        nome: nome.trim(),
        email: normalizedEmail
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const userId = parseId(req.params.id);

    if (!userId) {
      return res.status(400).json({
        mensagem: "O ID do usuario deve ser um numero inteiro maior que zero."
      });
    }

    const result = await run("DELETE FROM usuarios WHERE id = ?", [userId]);

    if (result.changes === 0) {
      return res.status(404).json({ mensagem: "Usuario nao encontrado." });
    }

    return res.status(200).json({
      mensagem: "Usuario removido com sucesso."
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createUser: register,
  listUsers,
  getUserById,
  updateUser,
  deleteUser
};
