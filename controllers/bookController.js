const { all, get, run } = require("../database/connection");
const { validateFieldsForProfanity } = require("../utils/contentModeration");
const {
  deleteUploadedImage,
  publicImageUrl,
  resolveImageInput,
  saveUploadedImage
} = require("../utils/bookImage");

function hasEmptyValue(value) {
  return typeof value !== "string" || value.trim() === "";
}

function serializeBook(req, book) {
  return {
    ...book,
    imagem: publicImageUrl(req, book.imagem)
  };
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
      livros: books.map((book) => serializeBook(req, book))
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
      livro: serializeBook(req, book)
    });
  } catch (error) {
    return next(error);
  }
}

async function createBook(req, res, next) {
  try {
    const { titulo, categoria, descricao, autor, faixa_etaria } = req.body;
    const imageInput = resolveImageInput(req);

    if (
      !imageInput ||
      hasEmptyValue(titulo) ||
      hasEmptyValue(categoria) ||
      hasEmptyValue(descricao) ||
      hasEmptyValue(autor) ||
      hasEmptyValue(faixa_etaria)
    ) {
      return res.status(400).json({
        mensagem: "Envie uma imagem por URL ou upload e preencha titulo, categoria, descricao, autor e faixa_etaria."
      });
    }

    const profanityValidation = validateFieldsForProfanity({
      titulo,
      categoria,
      descricao,
      autor
    });

    if (profanityValidation) {
      return res.status(400).json({
        mensagem: `O campo ${profanityValidation.field} contem linguagem impropria e nao pode ser salvo.`
      });
    }

    const imageValue = imageInput.type === "upload"
      ? await saveUploadedImage(imageInput.file)
      : imageInput.value;
    let result;

    try {
      result = await run(
        `INSERT INTO livros (imagem, titulo, categoria, descricao, autor, faixa_etaria)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          imageValue,
          titulo.trim(),
          categoria.trim(),
          descricao.trim(),
          autor.trim(),
          faixa_etaria.trim()
        ]
      );
    } catch (error) {
      await deleteUploadedImage(imageValue);
      throw error;
    }

    const createdBook = {
      id: result.lastID,
      imagem: imageValue,
      titulo: titulo.trim(),
      categoria: categoria.trim(),
      descricao: descricao.trim(),
      autor: autor.trim(),
      faixa_etaria: faixa_etaria.trim()
    };

    return res.status(201).json({
      mensagem: "Livro cadastrado com sucesso.",
      livro: serializeBook(req, createdBook)
    });
  } catch (error) {
    return next(error);
  }
}

async function updateBook(req, res, next) {
  try {
    const bookId = Number.parseInt(req.params.id, 10);
    const { titulo, categoria, descricao, autor, faixa_etaria } = req.body;
    const imageInput = resolveImageInput(req);

    if (Number.isNaN(bookId) || bookId <= 0) {
      return res.status(400).json({
        mensagem: "O ID do livro deve ser um numero inteiro maior que zero."
      });
    }

    if (
      !imageInput ||
      hasEmptyValue(titulo) ||
      hasEmptyValue(categoria) ||
      hasEmptyValue(descricao) ||
      hasEmptyValue(autor) ||
      hasEmptyValue(faixa_etaria)
    ) {
      return res.status(400).json({
        mensagem: "Envie uma imagem por URL ou upload e preencha titulo, categoria, descricao, autor e faixa_etaria."
      });
    }

    const existingBook = await get("SELECT id, imagem FROM livros WHERE id = ?", [bookId]);

    if (!existingBook) {
      return res.status(404).json({
        mensagem: "Livro nao encontrado."
      });
    }

    const profanityValidation = validateFieldsForProfanity({
      titulo,
      categoria,
      descricao,
      autor
    });

    if (profanityValidation) {
      return res.status(400).json({
        mensagem: `O campo ${profanityValidation.field} contem linguagem impropria e nao pode ser salvo.`
      });
    }

    const imageValue = imageInput.type === "upload"
      ? await saveUploadedImage(imageInput.file)
      : imageInput.value;

    try {
      await run(
        `UPDATE livros
         SET imagem = ?, titulo = ?, categoria = ?, descricao = ?, autor = ?, faixa_etaria = ?
         WHERE id = ?`,
        [
          imageValue,
          titulo.trim(),
          categoria.trim(),
          descricao.trim(),
          autor.trim(),
          faixa_etaria.trim(),
          bookId
        ]
      );
    } catch (error) {
      await deleteUploadedImage(imageValue);
      throw error;
    }

    if (existingBook.imagem !== imageValue) {
      await deleteUploadedImage(existingBook.imagem).catch(console.error);
    }

    const updatedBook = {
      id: bookId,
      imagem: imageValue,
      titulo: titulo.trim(),
      categoria: categoria.trim(),
      descricao: descricao.trim(),
      autor: autor.trim(),
      faixa_etaria: faixa_etaria.trim()
    };

    return res.status(200).json({
      mensagem: "Livro atualizado com sucesso.",
      livro: serializeBook(req, updatedBook)
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteBook(req, res, next) {
  try {
    const bookId = Number.parseInt(req.params.id, 10);

    if (Number.isNaN(bookId) || bookId <= 0) {
      return res.status(400).json({
        mensagem: "O ID do livro deve ser um numero inteiro maior que zero."
      });
    }

    const existingBook = await get("SELECT id, imagem FROM livros WHERE id = ?", [bookId]);

    if (!existingBook) {
      return res.status(404).json({
        mensagem: "Livro nao encontrado."
      });
    }

    await run("DELETE FROM livros WHERE id = ?", [bookId]);
    await deleteUploadedImage(existingBook.imagem).catch(console.error);

    return res.status(200).json({
      mensagem: "Livro removido com sucesso."
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};
