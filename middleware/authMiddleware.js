const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");
const { get } = require("../database/connection");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      mensagem: "Token nao enviado."
    });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      mensagem: "Formato do token invalido. Use Bearer TOKEN."
    });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret);
    const user = await get(
      "SELECT id, nome, email FROM usuarios WHERE id = ?",
      [decoded.id]
    );

    if (!user) {
      return res.status(401).json({
        mensagem: "Usuario do token nao existe mais. Faca login novamente."
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({
      mensagem: "Token invalido ou expirado."
    });
  }
}

module.exports = authMiddleware;
