const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt");

function authMiddleware(req, res, next) {
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
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({
      mensagem: "Token invalido ou expirado."
    });
  }
}

module.exports = authMiddleware;
