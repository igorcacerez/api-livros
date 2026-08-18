const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { get, run } = require("../database/connection");
const jwtConfig = require("../config/jwt");
const { validateFieldsForProfanity } = require("../utils/contentModeration");

function hasEmptyValue(value) {
  return typeof value !== "string" || value.trim() === "";
}

async function register(req, res, next) {
  try {
    const { nome, email, senha } = req.body;

    if (hasEmptyValue(nome) || hasEmptyValue(email) || hasEmptyValue(senha)) {
      return res.status(400).json({
        mensagem: "Os campos nome, email e senha sao obrigatorios."
      });
    }

    const profanityValidation = validateFieldsForProfanity({
      nome,
      email
    });

    if (profanityValidation) {
      return res.status(400).json({
        mensagem: `O campo ${profanityValidation.field} contem linguagem impropria e nao pode ser salvo.`
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await get(
      "SELECT id FROM usuarios WHERE email = ?",
      [normalizedEmail]
    );

    if (existingUser) {
      return res.status(409).json({
        mensagem: "Ja existe um usuario cadastrado com este email."
      });
    }

    const passwordHash = await bcrypt.hash(senha, 10);
    const result = await run(
      "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
      [nome.trim(), normalizedEmail, passwordHash]
    );

    return res.status(201).json({
      mensagem: "Usuario cadastrado com sucesso.",
      usuario: {
        id: result.lastID,
        nome: nome.trim(),
        email: normalizedEmail
      }
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, senha } = req.body;

    if (hasEmptyValue(email) || hasEmptyValue(senha)) {
      return res.status(400).json({
        mensagem: "Os campos email e senha sao obrigatorios."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await get(
      "SELECT id, nome, email, senha FROM usuarios WHERE email = ?",
      [normalizedEmail]
    );

    if (!user || !(await bcrypt.compare(senha, user.senha))) {
      return res.status(401).json({
        mensagem: "Credenciais invalidas."
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        nome: user.nome,
        email: user.email
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    const publicUser = {
      id: user.id,
      nome: user.nome,
      email: user.email
    };

    return res.status(200).json({
      mensagem: "Login realizado com sucesso.",
      token,
      usuario: publicUser
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login
};
