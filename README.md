# API de Livros

API REST didática construída com Node.js, Express, SQLite e JWT. O projeto oferece CRUD de usuários, login com Bearer token e CRUD autenticado de livros.

## Requisitos

- Node.js 18 ou superior
- npm

## Instalação e execução

```bash
npm install
npm start
```

A API inicia em `http://localhost:3000`. A documentação interativa fica em:

- Swagger UI: `http://localhost:3000/docs`
- Documento OpenAPI em JSON: `http://localhost:3000/docs.json`

No ambiente hospedado:

- API: `https://apps-api-livros.ucxocw.easypanel.host`
- Swagger UI: `https://apps-api-livros.ucxocw.easypanel.host/docs`
- Documento OpenAPI: `https://apps-api-livros.ucxocw.easypanel.host/docs.json`

Na primeira execução, o banco `database/app.db`, as tabelas e os dados iniciais são criados automaticamente. O catálogo inicial contém 50 livros reais. Títulos, autores e capas foram conferidos com o catálogo e a API de capas da [Open Library](https://openlibrary.org/developers/api).

A versão do catálogo fica registrada no banco. Assim, esta atualização substitui uma única vez a carga antiga de 20 livros, mas deploys posteriores não apagam livros cadastrados pela API.

## Usuário inicial

```text
email: admin@gmail.com
senha: senai123
```

As senhas são armazenadas com hash bcrypt. Bancos antigos do projeto, que ainda tenham senhas em texto puro, são migrados automaticamente na inicialização.

## Autenticação

Faça login em `POST /auth/login`. Copie o campo `token` da resposta e envie-o nas rotas privadas:

```http
Authorization: Bearer SEU_TOKEN
```

O token expira em 10 horas. Se o usuário for removido, o token deixa de ser aceito imediatamente.

## Rotas públicas

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/usuarios` | Cadastra um usuário |
| `POST` | `/auth/login` | Realiza login |
| `GET` | `/livros` | Lista e filtra livros |
| `GET` | `/docs` | Abre o Swagger UI |
| `GET` | `/docs.json` | Retorna o documento OpenAPI |

Entre as rotas de livros, somente `GET /livros` é pública. Consultar um livro por ID, cadastrar, atualizar ou excluir exige autenticação.

## CRUD de usuários

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| `POST` | `/usuarios` | Não | Cadastra um usuário |
| `GET` | `/usuarios` | Bearer | Lista usuários |
| `GET` | `/usuarios/:id` | Bearer | Busca um usuário |
| `PUT` | `/usuarios/:id` | Bearer | Atualiza nome, email e senha |
| `DELETE` | `/usuarios/:id` | Bearer | Exclui um usuário |

Corpo de cadastro e atualização:

```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "senha": "123456"
}
```

A senha nunca aparece nas respostas da API.

## Login

### `POST /auth/login`

```json
{
  "email": "admin@gmail.com",
  "senha": "senai123"
}
```

Exemplo de resposta:

```json
{
  "mensagem": "Login realizado com sucesso.",
  "token": "TOKEN_JWT",
  "usuario": {
    "id": 1,
    "nome": "Admin",
    "email": "admin@gmail.com"
  }
}
```

## CRUD de livros

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| `GET` | `/livros` | Não | Lista livros |
| `GET` | `/livros/:id` | Bearer | Busca um livro |
| `POST` | `/livros` | Bearer | Cadastra um livro |
| `PUT` | `/livros/:id` | Bearer | Atualiza um livro |
| `DELETE` | `/livros/:id` | Bearer | Exclui um livro |

Filtros opcionais da listagem:

- `titulo`
- `autor`
- `categoria`
- `limit`, número inteiro maior que zero

Exemplo: `GET /livros?categoria=Fantasia&limit=5`.

### Opção 1: imagem por URL

Envie JSON com a URL completa no campo `imagem`:

```json
{
  "imagem": "https://exemplo.com/capa.jpg",
  "titulo": "Novo Livro",
  "categoria": "Fantasia",
  "descricao": "Descrição do livro.",
  "autor": "Autor Exemplo",
  "faixa_etaria": "14+"
}
```

### Opção 2: upload da imagem

Envie `multipart/form-data` usando `imagem` para o arquivo e os demais campos como texto. São aceitos JPEG, PNG, GIF e WebP de até 5 MB.

```bash
curl -X POST http://localhost:3000/livros \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "imagem=@./capa.png" \
  -F "titulo=Livro com Upload" \
  -F "categoria=Educação" \
  -F "descricao=Descrição do livro" \
  -F "autor=Autor Exemplo" \
  -F "faixa_etaria=Não informada"
```

As imagens enviadas ficam disponíveis publicamente em `/uploads/NOME_DO_ARQUIVO`. Ao substituir ou excluir um livro, a imagem local anterior também é removida.

## Exemplo completo com curl

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gmail.com","senha":"senai123"}'
```

Depois, use o token retornado:

```bash
curl -X POST http://localhost:3000/livros \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"imagem":"https://exemplo.com/capa.jpg","titulo":"Livro Teste","categoria":"Educação","descricao":"Descrição","autor":"Autor","faixa_etaria":"Livre"}'
```

## Compatibilidade com as rotas antigas

Para não quebrar os exemplos já usados pelos alunos, os aliases `/livro`, `/livro/:id`, `/cadastro` e `/login` continuam funcionando. Os novos exemplos e o Swagger usam as rotas padronizadas `/livros`, `/usuarios` e `/auth/login`.

## Variáveis de ambiente

| Variável | Padrão | Uso |
| --- | --- | --- |
| `PORT` | `3000` | Porta HTTP |
| `JWT_SECRET` | chave local de desenvolvimento | Segredo de assinatura do JWT |
| `APP_DB_PATH` | `database/app.db` | Caminho alternativo para o SQLite |
| `UPLOAD_DIR` | `uploads` dentro do projeto | Diretório persistente dos uploads |

Em produção, defina obrigatoriamente um `JWT_SECRET` forte.

No EasyPanel, monte volumes persistentes e use:

```env
APP_DB_PATH=/data/app.db
UPLOAD_DIR=/uploads
```

## Testes

```bash
npm test
```

Os testes de integração usam um banco temporário e verificam acesso público, autenticação, CRUD de usuários, CRUD de livros e o documento OpenAPI.

## Estrutura

```text
api-livros/
|-- config/
|-- controllers/
|-- database/
|-- docs/
|-- middleware/
|-- routes/
|-- test/
|-- utils/
|-- package.json
|-- README.md
`-- server.js
```
