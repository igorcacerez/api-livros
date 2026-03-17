module.exports = {
  secret: process.env.JWT_SECRET || "chave-secreta-api-test",
  expiresIn: "2h"
};
