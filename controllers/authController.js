const jwt = require("jsonwebtoken");
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

    const result = await run(
      "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
      [nome.trim(), normalizedEmail, senha]
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
      "SELECT id, nome, email FROM usuarios WHERE email = ? AND senha = ?",
      [normalizedEmail, senha]
    );

    if (!user) {
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

    return res.status(200).json({
      mensagem: "Login realizado com sucesso.",
      token,
      usuario: user
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login
};
