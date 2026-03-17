const { all, get, run } = require("../database/connection");

function hasEmptyValue(value) {
  return typeof value !== "string" || value.trim() === "";
}

async function listBooks(req, res, next) {
  try {
    const { titulo, autor, categoria, limit } = req.query;
    const filters = [];
    const params = [];

    if (titulo) {
      filters.push("titulo LIKE ?");
      params.push(`%${titulo}%`);
    }

    if (autor) {
      filters.push("autor LIKE ?");
      params.push(`%${autor}%`);
    }

    if (categoria) {
      filters.push("categoria LIKE ?");
      params.push(`%${categoria}%`);
    }

    let query = `
      SELECT id, imagem, titulo, categoria, descricao, autor, faixa_etaria
      FROM livros
    `;

    if (filters.length > 0) {
      query += ` WHERE ${filters.join(" AND ")}`;
    }

    query += " ORDER BY id ASC";

    if (limit !== undefined) {
      const parsedLimit = Number.parseInt(limit, 10);

      if (Number.isNaN(parsedLimit) || parsedLimit <= 0) {
        return res.status(400).json({
          mensagem: "O parametro limit deve ser um numero inteiro maior que zero."
        });
      }

      query += " LIMIT ?";
      params.push(parsedLimit);
    }

    const books = await all(query, params);

    return res.status(200).json({
      total: books.length,
      livros: books
    });
  } catch (error) {
    return next(error);
  }
}

async function getBookById(req, res, next) {
  try {
    const bookId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(bookId) || bookId <= 0) {
      return res.status(400).json({
        mensagem: "O ID do livro deve ser um numero inteiro maior que zero."
      });
    }

    const book = await get(
      `SELECT id, imagem, titulo, categoria, descricao, autor, faixa_etaria
       FROM livros
       WHERE id = ?`,
      [bookId]
    );

    if (!book) {
      return res.status(404).json({
        mensagem: "Livro nao encontrado."
      });
    }

    return res.status(200).json({
      livro: book
    });
  } catch (error) {
    return next(error);
  }
}

async function createBook(req, res, next) {
  try {
    const { imagem, titulo, categoria, descricao, autor, faixa_etaria } = req.body;

    if (
      hasEmptyValue(imagem) ||
      hasEmptyValue(titulo) ||
      hasEmptyValue(categoria) ||
      hasEmptyValue(descricao) ||
      hasEmptyValue(autor) ||
      hasEmptyValue(faixa_etaria)
    ) {
      return res.status(400).json({
        mensagem: "Os campos imagem, titulo, categoria, descricao, autor e faixa_etaria sao obrigatorios."
      });
    }

    const result = await run(
      `INSERT INTO livros (imagem, titulo, categoria, descricao, autor, faixa_etaria)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        imagem.trim(),
        titulo.trim(),
        categoria.trim(),
        descricao.trim(),
        autor.trim(),
        faixa_etaria.trim()
      ]
    );

    return res.status(201).json({
      mensagem: "Livro cadastrado com sucesso.",
      livro: {
        id: result.lastID,
        imagem: imagem.trim(),
        titulo: titulo.trim(),
        categoria: categoria.trim(),
        descricao: descricao.trim(),
        autor: autor.trim(),
        faixa_etaria: faixa_etaria.trim()
      }
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listBooks,
  getBookById,
  createBook
};
