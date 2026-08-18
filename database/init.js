const bcrypt = require("bcryptjs");
const { all, run } = require("./connection");
const { seedInitialData } = require("./seed");

async function migratePlainTextPasswords() {
  const users = await all("SELECT id, senha FROM usuarios");

  for (const user of users) {
    if (!user.senha.startsWith("$2")) {
      const passwordHash = await bcrypt.hash(user.senha, 10);
      await run("UPDATE usuarios SET senha = ? WHERE id = ?", [passwordHash, user.id]);
    }
  }
}

async function initializeDatabase() {
  await run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      senha TEXT NOT NULL
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS livros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      imagem TEXT NOT NULL,
      titulo TEXT NOT NULL,
      categoria TEXT NOT NULL,
      descricao TEXT NOT NULL,
      autor TEXT NOT NULL,
      faixa_etaria TEXT NOT NULL
    )
  `);

  await migratePlainTextPasswords();
  await seedInitialData();
}

module.exports = {
  initializeDatabase
};
