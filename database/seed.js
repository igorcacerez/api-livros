const bcrypt = require("bcryptjs");
const { get, run } = require("./connection");

const CATALOG_VERSION = "catalogo-real-v1-2026-08";

const initialUser = {
  nome: "Admin",
  email: "admin@gmail.com",
  senha: "senai123"
};

function openLibraryCover(coverId) {
  return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
}

function openLibraryIsbnCover(isbn) {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
}

function openLibraryEditionCover(editionId) {
  return `https://covers.openlibrary.org/b/olid/${editionId}-L.jpg`;
}

const initialBooks = [
  {
    imagem: openLibraryCover(647501),
    titulo: "Dom Casmurro",
    categoria: "Literatura Brasileira",
    descricao: "Bento Santiago relembra sua juventude e o relacionamento com Capitu em uma narrativa marcada por memoria e ciume.",
    autor: "Machado de Assis",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(123152),
    titulo: "Memorias Postumas de Bras Cubas",
    categoria: "Literatura Brasileira",
    descricao: "Bras Cubas narra a propria vida depois de morto, examinando com ironia a sociedade brasileira do seculo XIX.",
    autor: "Machado de Assis",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(8176059),
    titulo: "O Cortico",
    categoria: "Literatura Brasileira",
    descricao: "Romance naturalista que acompanha moradores de um cortico no Rio de Janeiro e as tensoes sociais ao seu redor.",
    autor: "Aluisio Azevedo",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(2664651),
    titulo: "Iracema",
    categoria: "Literatura Brasileira",
    descricao: "O romance acompanha a indigena Iracema e o portugues Martim durante a colonizacao do territorio cearense.",
    autor: "Jose de Alencar",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(12875748),
    titulo: "Um Conto de Natal",
    categoria: "Novela",
    descricao: "Ebenezer Scrooge recebe a visita de espiritos que o fazem rever sua relacao com o dinheiro e com outras pessoas.",
    autor: "Charles Dickens",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryIsbnCover("9788501067340"),
    titulo: "Vidas Secas",
    categoria: "Literatura Brasileira",
    descricao: "Uma familia de retirantes atravessa o sertao nordestino enfrentando seca, pobreza e deslocamento.",
    autor: "Graciliano Ramos",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryEditionCover("OL62256210M"),
    titulo: "Capitaes da Areia",
    categoria: "Literatura Brasileira",
    descricao: "Um grupo de meninos em situacao de rua vive entre aventuras e exclusao social na cidade de Salvador.",
    autor: "Jorge Amado",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryIsbnCover("9788532508126"),
    titulo: "A Hora da Estrela",
    categoria: "Literatura Brasileira",
    descricao: "Rodrigo S. M. conta a historia de Macabea, jovem alagoana que leva uma vida anonima no Rio de Janeiro.",
    autor: "Clarice Lispector",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryEditionCover("OL20041656M"),
    titulo: "Grande Sertao: Veredas",
    categoria: "Literatura Brasileira",
    descricao: "Riobaldo relembra sua vida entre jaguncos, os conflitos do sertao e sua relacao com Diadorim.",
    autor: "Joao Guimaraes Rosa",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryEditionCover("OL38221997M"),
    titulo: "Quarto de Despejo",
    categoria: "Diario",
    descricao: "Os diarios de Carolina Maria de Jesus registram seu cotidiano na favela do Caninde, em Sao Paulo.",
    autor: "Carolina Maria de Jesus",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryIsbnCover("9780061122415"),
    titulo: "O Alquimista",
    categoria: "Ficcao",
    descricao: "O pastor Santiago viaja da Espanha ao Egito em busca de um tesouro e de sua realizacao pessoal.",
    autor: "Paulo Coelho",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(12369648),
    titulo: "Torto Arado",
    categoria: "Literatura Brasileira",
    descricao: "As irmas Bibiana e Belonisia vivem conflitos ligados a terra, ancestralidade e desigualdade na zona rural da Bahia.",
    autor: "Itamar Vieira Junior",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryIsbnCover("9780156012195"),
    titulo: "O Pequeno Principe",
    categoria: "Fabula",
    descricao: "Um aviador perdido no deserto conhece um pequeno principe que relata suas viagens por diferentes planetas.",
    autor: "Antoine de Saint-Exupery",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(9267242),
    titulo: "1984",
    categoria: "Distopia",
    descricao: "Winston Smith vive sob vigilancia permanente do Partido no estado totalitario da Oceania.",
    autor: "George Orwell",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(11261770),
    titulo: "A Revolucao dos Bichos",
    categoria: "Satira Politica",
    descricao: "Animais tomam uma fazenda e constroem um novo regime que gradualmente reproduz a opressao anterior.",
    autor: "George Orwell",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(14348537),
    titulo: "Orgulho e Preconceito",
    categoria: "Romance",
    descricao: "Elizabeth Bennet e Fitzwilliam Darcy enfrentam julgamentos, diferencas sociais e os proprios preconceitos.",
    autor: "Jane Austen",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(8235363),
    titulo: "Jane Eyre",
    categoria: "Romance Gotico",
    descricao: "Uma jovem orfa torna-se governanta em Thornfield Hall e se aproxima de seu proprietario, Edward Rochester.",
    autor: "Charlotte Bronte",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(12818862),
    titulo: "O Morro dos Ventos Uivantes",
    categoria: "Romance Gotico",
    descricao: "A relacao intensa entre Catherine Earnshaw e Heathcliff afeta duas geracoes de familias em Yorkshire.",
    autor: "Emily Bronte",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(10544254),
    titulo: "Moby Dick",
    categoria: "Aventura",
    descricao: "Ismael embarca no baleeiro Pequod, comandado pelo capitao Ahab em sua obsessiva caca a baleia branca.",
    autor: "Herman Melville",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(10590366),
    titulo: "O Grande Gatsby",
    categoria: "Romance",
    descricao: "Nick Carraway observa a vida de Jay Gatsby e os excessos da elite americana durante a Era do Jazz.",
    autor: "F. Scott Fitzgerald",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(14351077),
    titulo: "O Sol e para Todos",
    categoria: "Drama",
    descricao: "Scout acompanha o pai, Atticus Finch, na defesa de um homem negro acusado injustamente no Alabama.",
    autor: "Harper Lee",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(9273490),
    titulo: "O Apanhador no Campo de Centeio",
    categoria: "Romance de Formacao",
    descricao: "Holden Caulfield passa alguns dias em Nova York depois de ser expulso de mais uma escola.",
    autor: "J. D. Salinger",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(13116014),
    titulo: "Crime e Castigo",
    categoria: "Romance Psicologico",
    descricao: "Raskolnikov comete um assassinato em Sao Petersburgo e enfrenta culpa, medo e consequencias morais.",
    autor: "Fiodor Dostoievski",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(11263774),
    titulo: "Os Irmaos Karamazov",
    categoria: "Romance Filosofico",
    descricao: "Os conflitos da familia Karamazov envolvem fe, responsabilidade moral e a investigacao de um parricidio.",
    autor: "Fiodor Dostoievski",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(2560652),
    titulo: "Anna Karenina",
    categoria: "Romance",
    descricao: "Anna desafia convencoes da aristocracia russa ao viver um relacionamento com o conde Vronsky.",
    autor: "Lev Tolstoi",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(12621906),
    titulo: "Guerra e Paz",
    categoria: "Romance Historico",
    descricao: "Familias aristocraticas russas atravessam as guerras napoleonicas e suas transformacoes sociais.",
    autor: "Lev Tolstoi",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(14428305),
    titulo: "Dom Quixote",
    categoria: "Satira",
    descricao: "Alonso Quijano assume a identidade de Dom Quixote e parte em aventuras ao lado de Sancho Panca.",
    autor: "Miguel de Cervantes",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(12721865),
    titulo: "Os Miseraveis",
    categoria: "Romance Historico",
    descricao: "Jean Valjean busca reconstruir a vida enquanto e perseguido pelo inspetor Javert na Franca do seculo XIX.",
    autor: "Victor Hugo",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(12993424),
    titulo: "Madame Bovary",
    categoria: "Realismo",
    descricao: "Emma Bovary tenta escapar da insatisfacao com a vida provinciana por meio de romances e consumo.",
    autor: "Gustave Flaubert",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(12216503),
    titulo: "Dracula",
    categoria: "Terror Gotico",
    descricao: "Documentos e cartas narram o confronto de um grupo de pessoas com o conde Dracula.",
    autor: "Bram Stoker",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(12356249),
    titulo: "Frankenstein",
    categoria: "Terror Gotico",
    descricao: "Victor Frankenstein cria um ser vivo e precisa lidar com as consequencias de abandona-lo.",
    autor: "Mary Shelley",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(14314858),
    titulo: "O Retrato de Dorian Gray",
    categoria: "Romance Gotico",
    descricao: "Dorian Gray permanece jovem enquanto seu retrato registra os efeitos de seus atos e do tempo.",
    autor: "Oscar Wilde",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(10527843),
    titulo: "Alice no Pais das Maravilhas",
    categoria: "Fantasia",
    descricao: "Alice segue um coelho branco e entra em um mundo de personagens e acontecimentos fantasticos.",
    autor: "Lewis Carroll",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(552443),
    titulo: "O Maravilhoso Magico de Oz",
    categoria: "Fantasia",
    descricao: "Dorothy viaja pela terra de Oz com novos companheiros enquanto procura um caminho de volta para casa.",
    autor: "L. Frank Baum",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(13859660),
    titulo: "A Ilha do Tesouro",
    categoria: "Aventura",
    descricao: "Jim Hawkins encontra um mapa e embarca em uma expedicao marcada por piratas e um tesouro escondido.",
    autor: "Robert Louis Stevenson",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(14627509),
    titulo: "O Hobbit",
    categoria: "Fantasia",
    descricao: "Bilbo Bolseiro acompanha um grupo de anoes em uma jornada para recuperar um reino ocupado pelo dragao Smaug.",
    autor: "J. R. R. Tolkien",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(14627060),
    titulo: "A Sociedade do Anel",
    categoria: "Fantasia",
    descricao: "Frodo deixa o Condado com a missao de levar o Um Anel para longe das forcas de Sauron.",
    autor: "J. R. R. Tolkien",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(15155833),
    titulo: "Harry Potter e a Pedra Filosofal",
    categoria: "Fantasia",
    descricao: "Harry descobre que e bruxo, ingressa em Hogwarts e investiga um misterio ligado a Pedra Filosofal.",
    autor: "J. K. Rowling",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(11481354),
    titulo: "Duna",
    categoria: "Ficcao Cientifica",
    descricao: "Paul Atreides chega a Arrakis, planeta desertico que produz a especiaria mais valiosa do imperio.",
    autor: "Frank Herbert",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(14612610),
    titulo: "Fundacao",
    categoria: "Ficcao Cientifica",
    descricao: "Hari Seldon usa a psico-historia para prever a queda do Imperio Galactico e reduzir uma era de barbarie.",
    autor: "Isaac Asimov",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(8231823),
    titulo: "Admiravel Mundo Novo",
    categoria: "Distopia",
    descricao: "Uma sociedade futura organiza pessoas em castas e condiciona comportamentos desde o nascimento.",
    autor: "Aldous Huxley",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryIsbnCover("9781451673319"),
    titulo: "Fahrenheit 451",
    categoria: "Distopia",
    descricao: "Guy Montag trabalha queimando livros ate comecar a questionar a sociedade em que vive.",
    autor: "Ray Bradbury",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryIsbnCover("9780385490818"),
    titulo: "O Conto da Aia",
    categoria: "Distopia",
    descricao: "Offred relata sua vida na Republica de Gilead, regime que controla os corpos e os direitos das mulheres.",
    autor: "Margaret Atwood",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(283860),
    titulo: "Neuromancer",
    categoria: "Cyberpunk",
    descricao: "O hacker Case recebe uma oportunidade de voltar ao ciberespaco ao participar de uma operacao perigosa.",
    autor: "William Gibson",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(12986869),
    titulo: "O Guia do Mochileiro das Galaxias",
    categoria: "Ficcao Cientifica",
    descricao: "Arthur Dent escapa da destruicao da Terra e inicia uma viagem absurda pela galaxia.",
    autor: "Douglas Adams",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(8634250),
    titulo: "Sapiens",
    categoria: "Historia",
    descricao: "Yuval Noah Harari apresenta uma sintese da trajetoria do Homo sapiens da pre-historia ao mundo moderno.",
    autor: "Yuval Noah Harari",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(3825693),
    titulo: "Primavera Silenciosa",
    categoria: "Meio Ambiente",
    descricao: "Rachel Carson examina os impactos ambientais do uso indiscriminado de pesticidas sinteticos.",
    autor: "Rachel Carson",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(10432365),
    titulo: "Uma Breve Historia do Tempo",
    categoria: "Divulgacao Cientifica",
    descricao: "Stephen Hawking apresenta conceitos de cosmologia, origem do universo, tempo e buracos negros.",
    autor: "Stephen Hawking",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(8065615),
    titulo: "Clean Code",
    categoria: "Tecnologia",
    descricao: "O livro discute principios e praticas para produzir codigo legivel e facilitar sua manutencao.",
    autor: "Robert C. Martin",
    faixa_etaria: "Nao informada"
  },
  {
    imagem: openLibraryCover(6601119),
    titulo: "Design Patterns",
    categoria: "Tecnologia",
    descricao: "Os autores apresentam 23 padroes de projeto reutilizaveis para software orientado a objetos.",
    autor: "Erich Gamma, Richard Helm, Ralph Johnson e John Vlissides",
    faixa_etaria: "Nao informada"
  }
];

async function seedInitialData() {
  const existingAdmin = await get(
    "SELECT id FROM usuarios WHERE email = ?",
    [initialUser.email]
  );

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(initialUser.senha, 10);
    await run(
      "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
      [initialUser.nome, initialUser.email, passwordHash]
    );
  }

  const catalogVersion = await get(
    "SELECT valor FROM configuracoes WHERE chave = ?",
    ["catalogo_livros"]
  );

  if (catalogVersion?.valor === CATALOG_VERSION) {
    return;
  }

  await run("BEGIN TRANSACTION");

  try {
    await run("DELETE FROM livros");
    await run("DELETE FROM sqlite_sequence WHERE name = ?", ["livros"]);

    for (const book of initialBooks) {
      await run(
        `INSERT INTO livros (imagem, titulo, categoria, descricao, autor, faixa_etaria)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          book.imagem,
          book.titulo,
          book.categoria,
          book.descricao,
          book.autor,
          book.faixa_etaria
        ]
      );
    }

    await run(
      `INSERT INTO configuracoes (chave, valor)
       VALUES (?, ?)
       ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor`,
      ["catalogo_livros", CATALOG_VERSION]
    );
    await run("COMMIT");
  } catch (error) {
    await run("ROLLBACK");
    throw error;
  }
}

module.exports = {
  seedInitialData
};
