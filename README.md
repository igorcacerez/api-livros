# API REST com Node.js, Express, SQLite e JWT

Projeto de API REST desenvolvido em JavaScript puro com cadastro e login de usuarios, autenticacao via JWT e gerenciamento de livros com SQLite.

Os cadastros e a alteracao de livros agora bloqueiam palavras de baixo calao nos campos textuais.

## Requisitos

- Node.js 18+ instalado
- npm instalado

## Instalacao

```bash
npm install
```

## Execucao

Modo padrao:

```bash
npm start
```

Modo desenvolvimento:

```bash
npm run dev
```

Ao iniciar:

- O banco SQLite e criado automaticamente em `database/app.db`
- As tabelas `usuarios` e `livros` sao criadas automaticamente
- O usuario inicial e inserido, caso nao exista
- Os 20 livros iniciais sao inseridos automaticamente, caso a tabela esteja vazia

## Usuario inicial

- Email: `admin@gmail.com`
- Senha: `senai123`

## Rotas

### `POST /cadastro`

Cadastra um novo usuario.

#### Body

```json
{
  "nome": "Maria Silva",
  "email": "maria@gmail.com",
  "senha": "123456"
}
```

### `POST /login`

Realiza login e retorna um token JWT.

#### Body

```json
{
  "email": "admin@gmail.com",
  "senha": "senai123"
}
```

### `GET /livro`

Rota publica para listar livros. Cada item retornado inclui o `id` do livro.

#### Query params opcionais

- `titulo`
- `autor`
- `categoria`
- `limit`

#### Exemplos

```bash
GET /livro
GET /livro?limit=5
GET /livro?categoria=Fantasia
GET /livro?autor=George Orwell
GET /livro?titulo=Harry
```

### `GET /livro/:id`

Rota publica para buscar um livro especifico pelo ID informado na URL.

#### Exemplo

```bash
GET /livro/1
```

### `POST /livro`

Rota privada para cadastrar livro.

#### Header obrigatorio

```http
Authorization: Bearer SEU_TOKEN
```

#### Body

```json
{
  "imagem": "https://exemplo.com/livro.jpg",
  "titulo": "Novo Livro",
  "categoria": "Fantasia",
  "descricao": "Descricao do livro.",
  "autor": "Autor Exemplo",
  "faixa_etaria": "14+"
}
```

### `PUT /livro/:id`

Rota privada para alterar um livro existente.

#### Header obrigatorio

```http
Authorization: Bearer SEU_TOKEN
```

#### Body

```json
{
  "imagem": "https://exemplo.com/livro-atualizado.jpg",
  "titulo": "Livro Atualizado",
  "categoria": "Aventura",
  "descricao": "Nova descricao do livro.",
  "autor": "Autor Atualizado",
  "faixa_etaria": "12+"
}
```

### `DELETE /livro/:id`

Rota privada para remover um livro pelo ID.

#### Header obrigatorio

```http
Authorization: Bearer SEU_TOKEN
```

## Exemplo com curl

Cadastro:

```bash
curl -X POST http://localhost:3000/cadastro \
  -H "Content-Type: application/json" \
  -d "{\"nome\":\"Joao\",\"email\":\"joao@gmail.com\",\"senha\":\"123456\"}"
```

Login:

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@gmail.com\",\"senha\":\"senai123\"}"
```

Listar livros:

```bash
curl http://localhost:3000/livro
```

Buscar um livro por ID:

```bash
curl http://localhost:3000/livro/1
```

Cadastrar livro com token:

```bash
curl -X POST http://localhost:3000/livro \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d "{\"imagem\":\"https://exemplo.com/capa.jpg\",\"titulo\":\"Livro Teste\",\"categoria\":\"Drama\",\"descricao\":\"Descricao\",\"autor\":\"Autor\",\"faixa_etaria\":\"12+\"}"
```

Atualizar livro com token:

```bash
curl -X PUT http://localhost:3000/livro/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d "{\"imagem\":\"https://exemplo.com/capa-atualizada.jpg\",\"titulo\":\"Livro Teste Atualizado\",\"categoria\":\"Drama\",\"descricao\":\"Nova descricao\",\"autor\":\"Autor\",\"faixa_etaria\":\"12+\"}"
```

Deletar livro com token:

```bash
curl -X DELETE http://localhost:3000/livro/1 \
  -H "Authorization: Bearer SEU_TOKEN"
```

## Estrutura do projeto

```text
api-test/
|-- config/
|   `-- jwt.js
|-- controllers/
|   |-- authController.js
|   `-- bookController.js
|-- database/
|   |-- app.db
|   |-- connection.js
|   |-- init.js
|   `-- seed.js
|-- middleware/
|   `-- authMiddleware.js
|-- routes/
|   |-- authRoutes.js
|   `-- bookRoutes.js
|-- .gitignore
|-- package.json
|-- README.md
`-- server.js
```
