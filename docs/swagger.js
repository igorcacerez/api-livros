const swaggerDocument = {
  openapi: "3.0.3",
  info: {
    title: "API de Livros",
    version: "2.0.0",
    description:
      "API didatica para cadastro de usuarios, autenticacao Bearer com JWT e CRUD de livros. Somente a listagem de livros e o cadastro/login sao publicos."
  },
  servers: [
    {
      url: "https://apps-api-livros.ucxocw.easypanel.host",
      description: "Ambiente hospedado"
    },
    {
      url: "http://localhost:3000",
      description: "Ambiente local"
    }
  ],
  tags: [
    { name: "Autenticacao" },
    { name: "Usuarios" },
    { name: "Livros" }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      Mensagem: {
        type: "object",
        properties: {
          mensagem: { type: "string", example: "Operacao realizada com sucesso." }
        }
      },
      Usuario: {
        type: "object",
        required: ["id", "nome", "email"],
        properties: {
          id: { type: "integer", example: 1 },
          nome: { type: "string", example: "Maria Silva" },
          email: { type: "string", format: "email", example: "maria@email.com" }
        }
      },
      UsuarioInput: {
        type: "object",
        required: ["nome", "email", "senha"],
        properties: {
          nome: { type: "string", example: "Maria Silva" },
          email: { type: "string", format: "email", example: "maria@email.com" },
          senha: { type: "string", format: "password", example: "123456" }
        }
      },
      UsuarioResponse: {
        type: "object",
        properties: {
          mensagem: { type: "string" },
          usuario: { $ref: "#/components/schemas/Usuario" }
        }
      },
      LoginInput: {
        type: "object",
        required: ["email", "senha"],
        properties: {
          email: { type: "string", format: "email", example: "admin@gmail.com" },
          senha: { type: "string", format: "password", example: "senai123" }
        }
      },
      LoginResponse: {
        type: "object",
        properties: {
          mensagem: { type: "string" },
          token: { type: "string" },
          usuario: { $ref: "#/components/schemas/Usuario" }
        }
      },
      Livro: {
        type: "object",
        required: ["id", "imagem", "titulo", "categoria", "descricao", "autor", "faixa_etaria"],
        properties: {
          id: { type: "integer", example: 1 },
          imagem: { type: "string", format: "uri", example: "https://exemplo.com/capa.jpg" },
          titulo: { type: "string", example: "O Hobbit" },
          categoria: { type: "string", example: "Fantasia" },
          descricao: { type: "string", example: "Uma aventura inesperada." },
          autor: { type: "string", example: "J.R.R. Tolkien" },
          faixa_etaria: { type: "string", example: "10+" }
        }
      },
      LivroInput: {
        type: "object",
        required: ["imagem", "titulo", "categoria", "descricao", "autor", "faixa_etaria"],
        properties: {
          imagem: { type: "string", format: "uri", example: "https://exemplo.com/capa.jpg" },
          titulo: { type: "string", example: "O Hobbit" },
          categoria: { type: "string", example: "Fantasia" },
          descricao: { type: "string", example: "Uma aventura inesperada." },
          autor: { type: "string", example: "J.R.R. Tolkien" },
          faixa_etaria: { type: "string", example: "10+" }
        }
      },
      LivroResponse: {
        type: "object",
        properties: {
          mensagem: { type: "string" },
          livro: { $ref: "#/components/schemas/Livro" }
        }
      }
    },
    responses: {
      BadRequest: {
        description: "Dados invalidos",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Mensagem" } } }
      },
      Unauthorized: {
        description: "Token ausente, invalido ou expirado",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Mensagem" } } }
      },
      NotFound: {
        description: "Recurso nao encontrado",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Mensagem" } } }
      },
      Conflict: {
        description: "Email ja cadastrado",
        content: { "application/json": { schema: { $ref: "#/components/schemas/Mensagem" } } }
      }
    }
  },
  paths: {
    "/auth/login": {
      post: {
        tags: ["Autenticacao"],
        summary: "Realiza login",
        description: "Valida email e senha e retorna um JWT para uso como Bearer token.",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LoginInput" } } }
        },
        responses: {
          200: {
            description: "Login realizado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/LoginResponse" } } }
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" }
        }
      }
    },
    "/usuarios": {
      post: {
        tags: ["Usuarios"],
        summary: "Cadastra um usuario",
        description: "Rota publica. A senha e armazenada com hash e nunca e devolvida.",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UsuarioInput" } } }
        },
        responses: {
          201: {
            description: "Usuario criado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/UsuarioResponse" } } }
          },
          400: { $ref: "#/components/responses/BadRequest" },
          409: { $ref: "#/components/responses/Conflict" }
        }
      },
      get: {
        tags: ["Usuarios"],
        summary: "Lista usuarios",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Usuarios encontrados",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    total: { type: "integer" },
                    usuarios: { type: "array", items: { $ref: "#/components/schemas/Usuario" } }
                  }
                }
              }
            }
          },
          401: { $ref: "#/components/responses/Unauthorized" }
        }
      }
    },
    "/usuarios/{id}": {
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }
      ],
      get: {
        tags: ["Usuarios"],
        summary: "Busca um usuario",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Usuario encontrado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/UsuarioResponse" } } }
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" }
        }
      },
      put: {
        tags: ["Usuarios"],
        summary: "Atualiza um usuario",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UsuarioInput" } } }
        },
        responses: {
          200: {
            description: "Usuario atualizado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/UsuarioResponse" } } }
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          409: { $ref: "#/components/responses/Conflict" }
        }
      },
      delete: {
        tags: ["Usuarios"],
        summary: "Remove um usuario",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Usuario removido",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Mensagem" } } }
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" }
        }
      }
    },
    "/livros": {
      get: {
        tags: ["Livros"],
        summary: "Lista livros",
        description: "Unica rota de livros que nao exige autenticacao.",
        parameters: [
          { name: "titulo", in: "query", schema: { type: "string" } },
          { name: "autor", in: "query", schema: { type: "string" } },
          { name: "categoria", in: "query", schema: { type: "string" } },
          { name: "limit", in: "query", schema: { type: "integer", minimum: 1 } }
        ],
        responses: {
          200: {
            description: "Livros encontrados",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    total: { type: "integer" },
                    livros: { type: "array", items: { $ref: "#/components/schemas/Livro" } }
                  }
                }
              }
            }
          },
          400: { $ref: "#/components/responses/BadRequest" }
        }
      },
      post: {
        tags: ["Livros"],
        summary: "Cadastra um livro",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LivroInput" } } }
        },
        responses: {
          201: {
            description: "Livro criado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/LivroResponse" } } }
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" }
        }
      }
    },
    "/livros/{id}": {
      parameters: [
        { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }
      ],
      get: {
        tags: ["Livros"],
        summary: "Busca um livro",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Livro encontrado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/LivroResponse" } } }
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" }
        }
      },
      put: {
        tags: ["Livros"],
        summary: "Atualiza um livro",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LivroInput" } } }
        },
        responses: {
          200: {
            description: "Livro atualizado",
            content: { "application/json": { schema: { $ref: "#/components/schemas/LivroResponse" } } }
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" }
        }
      },
      delete: {
        tags: ["Livros"],
        summary: "Remove um livro",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Livro removido",
            content: { "application/json": { schema: { $ref: "#/components/schemas/Mensagem" } } }
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" }
        }
      }
    }
  }
};

module.exports = swaggerDocument;
