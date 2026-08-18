const express = require("express");
const swaggerUi = require("swagger-ui-express");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");
const { initializeDatabase } = require("./database/init");
const swaggerDocument = require("./docs/swagger");
const { uploadDirectory } = require("./config/upload");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("trust proxy", 1);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
});

app.use(express.json());
app.use("/uploads", express.static(uploadDirectory));

app.get("/", (req, res) => {
  res.status(200).json({
    mensagem: "API REST de livros em funcionamento.",
    documentacao: "/docs"
  });
});

app.get("/docs.json", (req, res) => res.json(swaggerDocument));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(authRoutes);
app.use(userRoutes);
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

  if (error.name === "MulterError") {
    return res.status(400).json({
      mensagem: error.code === "LIMIT_FILE_SIZE"
        ? "A imagem deve ter no maximo 5 MB."
        : "Nao foi possivel processar o upload da imagem."
    });
  }

  if (error.status && error.status >= 400 && error.status < 500) {
    return res.status(error.status).json({
      mensagem: error.message
    });
  }

  return res.status(500).json({
    mensagem: "Erro interno do servidor."
  });
});

async function startServer() {
  try {
    await initializeDatabase();

    return app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar a aplicacao:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = {
  app,
  startServer
};
