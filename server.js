const express = require("express");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const { initializeDatabase } = require("./database/init");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    mensagem: "API REST de livros em funcionamento."
  });
});

app.use(authRoutes);
app.use(bookRoutes);

app.use((req, res) => {
  res.status(404).json({
    mensagem: "Rota nao encontrada."
  });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      mensagem: "JSON invalido."
    });
  }

  return res.status(500).json({
    mensagem: "Erro interno do servidor."
  });
});

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar a aplicacao:", error);
    process.exit(1);
  }
}

startServer();
