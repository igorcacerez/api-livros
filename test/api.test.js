const assert = require("node:assert/strict");
const { after, before, test } = require("node:test");
const { mkdtemp, rm } = require("node:fs/promises");
const { spawn } = require("node:child_process");
const os = require("node:os");
const path = require("node:path");

const port = 32000 + (process.pid % 1000);
const baseUrl = `http://127.0.0.1:${port}`;
let serverProcess;
let temporaryDirectory;

async function request(route, options = {}) {
  const response = await fetch(`${baseUrl}${route}`, options);
  const body = await response.json();
  return { response, body };
}

before(async () => {
  temporaryDirectory = await mkdtemp(path.join(os.tmpdir(), "api-livros-"));
  serverProcess = spawn(process.execPath, ["server.js"], {
    cwd: path.resolve(__dirname, ".."),
    env: {
      ...process.env,
      PORT: String(port),
      APP_DB_PATH: path.join(temporaryDirectory, "test.db"),
      UPLOAD_DIR: path.join(temporaryDirectory, "uploads"),
      JWT_SECRET: "segredo-exclusivo-dos-testes"
    },
    stdio: ["ignore", "pipe", "pipe"]
  });

  let lastError;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(`${baseUrl}/livros`);
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw lastError || new Error("A API nao iniciou dentro do tempo esperado.");
});

after(async () => {
  if (serverProcess && !serverProcess.killed) {
    serverProcess.kill();
    await new Promise((resolve) => serverProcess.once("exit", resolve));
  }
  if (temporaryDirectory) {
    await rm(temporaryDirectory, { recursive: true, force: true });
  }
});

test("expoe somente a listagem de livros sem token", async () => {
  const list = await request("/livros");
  assert.equal(list.response.status, 200);
  assert.equal(list.body.total, 50);

  const details = await request("/livros/1");
  assert.equal(details.response.status, 401);

  const creation = await request("/livros", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  });
  assert.equal(creation.response.status, 401);
});

test("documenta a API com OpenAPI e esquema Bearer", async () => {
  const docs = await request("/docs.json");
  assert.equal(docs.response.status, 200);
  assert.equal(docs.body.openapi, "3.0.3");
  assert.equal(
    docs.body.servers[0].url,
    "https://apps-api-livros.ucxocw.easypanel.host"
  );
  assert.equal(docs.body.components.securitySchemes.bearerAuth.scheme, "bearer");
  assert.ok(docs.body.paths["/usuarios"]);
  assert.ok(docs.body.paths["/livros/{id}"]);
  assert.ok(docs.body.paths["/uploads/{arquivo}"]);
  assert.ok(
    docs.body.paths["/livros"].post.requestBody.content["multipart/form-data"]
  );
});

test("executa CRUD de usuarios e CRUD autenticado de livros", async () => {
  const jsonHeaders = { "Content-Type": "application/json" };
  const createdUser = await request("/usuarios", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({
      nome: "Usuario Teste",
      email: "teste@example.com",
      senha: "senha123"
    })
  });
  assert.equal(createdUser.response.status, 201);
  assert.equal(createdUser.body.usuario.senha, undefined);

  const login = await request("/auth/login", {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ email: "teste@example.com", senha: "senha123" })
  });
  assert.equal(login.response.status, 200);
  const authHeaders = {
    ...jsonHeaders,
    Authorization: `Bearer ${login.body.token}`
  };

  const users = await request("/usuarios", { headers: authHeaders });
  assert.equal(users.response.status, 200);
  assert.ok(users.body.total >= 2);

  const userId = createdUser.body.usuario.id;
  const updatedUser = await request(`/usuarios/${userId}`, {
    method: "PUT",
    headers: authHeaders,
    body: JSON.stringify({
      nome: "Usuario Atualizado",
      email: "atualizado@example.com",
      senha: "novaSenha123"
    })
  });
  assert.equal(updatedUser.response.status, 200);
  assert.equal(updatedUser.body.usuario.email, "atualizado@example.com");

  const createdBook = await request("/livros", {
    method: "POST",
    headers: authHeaders,
    body: JSON.stringify({
      imagem: "https://example.com/livro.jpg",
      titulo: "Livro de Teste",
      categoria: "Educacao",
      descricao: "Livro criado pela suite de integracao.",
      autor: "Autor Teste",
      faixa_etaria: "Livre"
    })
  });
  assert.equal(createdBook.response.status, 201);
  const bookId = createdBook.body.livro.id;

  const bookDetails = await request(`/livros/${bookId}`, { headers: authHeaders });
  assert.equal(bookDetails.response.status, 200);

  const updatedBook = await request(`/livros/${bookId}`, {
    method: "PUT",
    headers: authHeaders,
    body: JSON.stringify({
      imagem: "https://example.com/livro-atualizado.jpg",
      titulo: "Livro Atualizado",
      categoria: "Educacao",
      descricao: "Livro atualizado pela suite de integracao.",
      autor: "Autor Teste",
      faixa_etaria: "10+"
    })
  });
  assert.equal(updatedBook.response.status, 200);
  assert.equal(updatedBook.body.livro.titulo, "Livro Atualizado");

  const deletedBook = await request(`/livros/${bookId}`, {
    method: "DELETE",
    headers: authHeaders
  });
  assert.equal(deletedBook.response.status, 200);

  const uploadForm = new FormData();
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
    "base64"
  );
  uploadForm.append("imagem", new Blob([png], { type: "image/png" }), "capa.png");
  uploadForm.append("titulo", "Livro com Upload");
  uploadForm.append("categoria", "Educacao");
  uploadForm.append("descricao", "Livro com imagem enviada por arquivo.");
  uploadForm.append("autor", "Autor Teste");
  uploadForm.append("faixa_etaria", "Livre");

  const uploadedBookResponse = await fetch(`${baseUrl}/livros`, {
    method: "POST",
    headers: { Authorization: `Bearer ${login.body.token}` },
    body: uploadForm
  });
  const uploadedBook = await uploadedBookResponse.json();
  assert.equal(uploadedBookResponse.status, 201);
  assert.match(uploadedBook.livro.imagem, /\/uploads\/[a-f0-9-]+\.png$/);

  const uploadedImage = await fetch(uploadedBook.livro.imagem);
  assert.equal(uploadedImage.status, 200);
  assert.equal(uploadedImage.headers.get("content-type"), "image/png");

  const deletedUploadedBook = await request(`/livros/${uploadedBook.livro.id}`, {
    method: "DELETE",
    headers: authHeaders
  });
  assert.equal(deletedUploadedBook.response.status, 200);
  assert.equal((await fetch(uploadedBook.livro.imagem)).status, 404);

  const deletedUser = await request(`/usuarios/${userId}`, {
    method: "DELETE",
    headers: authHeaders
  });
  assert.equal(deletedUser.response.status, 200);

  const invalidatedToken = await request("/usuarios", { headers: authHeaders });
  assert.equal(invalidatedToken.response.status, 401);
});
