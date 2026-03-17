const { run } = require("./connection");
const { seedInitialData } = require("./seed");

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

  await seedInitialData();
}

module.exports = {
  initializeDatabase
};
