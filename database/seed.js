const { get, run } = require("./connection");

const initialUser = {
  nome: "Admin",
  email: "admin@gmail.com",
  senha: "senai123"
};

const initialBooks = [
  {
    imagem: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80",
    titulo: "O Nome do Vento",
    categoria: "Fantasia",
    descricao: "Um jovem musico e arcanista narra sua trajetoria marcada por talento, perdas e lendas.",
    autor: "Patrick Rothfuss",
    faixa_etaria: "16+"
  },
  {
    imagem: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
    titulo: "Dom Casmurro",
    categoria: "Classico",
    descricao: "Bentinho relembra seu passado e revisita um dos triangulos mais discutidos da literatura brasileira.",
    autor: "Machado de Assis",
    faixa_etaria: "14+"
  },
  {
    imagem: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
    titulo: "1984",
    categoria: "Distopia",
    descricao: "Uma sociedade vigiada pelo Estado em que pensar diferente pode ser o maior dos crimes.",
    autor: "George Orwell",
    faixa_etaria: "16+"
  },
  {
    imagem: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80",
    titulo: "A Revolucao dos Bichos",
    categoria: "Satira",
    descricao: "Fabula politica sobre poder, manipulacao e desigualdade em uma fazenda dominada por animais.",
    autor: "George Orwell",
    faixa_etaria: "12+"
  },
  {
    imagem: "https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=600&q=80",
    titulo: "Harry Potter e a Pedra Filosofal",
    categoria: "Fantasia",
    descricao: "Um garoto descobre ser bruxo e inicia sua jornada em Hogwarts.",
    autor: "J.K. Rowling",
    faixa_etaria: "10+"
  },
  {
    imagem: "https://images.unsplash.com/photo-1519682577862-22b62b24e493?auto=format&fit=crop&w=600&q=80",
    titulo: "Percy Jackson e o Ladrao de Raios",
    categoria: "Aventura",
    descricao: "Mitologia grega e aventuras modernas se encontram na vida de um adolescente semideus.",
    autor: "Rick Riordan",
    faixa_etaria: "12+"
  },
  {
    imagem: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=600&q=80",
    titulo: "Orgulho e Preconceito",
    categoria: "Romance",
    descricao: "Uma historia de ironia, costumes sociais e afetos em torno de Elizabeth Bennet e Mr. Darcy.",
    autor: "Jane Austen",
    faixa_etaria: "14+"
  },
  {
    imagem: "https://images.unsplash.com/photo-1513001900722-370f803f498d?auto=format&fit=crop&w=600&q=80",
    titulo: "O Hobbit",
    categoria: "Fantasia",
    descricao: "Bilbo Bolseiro embarca em uma expedicao inesperada por tesouros, dragoes e coragem.",
    autor: "J.R.R. Tolkien",
    faixa_etaria: "10+"
  },
  {
    imagem: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80",
    titulo: "A Menina que Roubava Livros",
    categoria: "Drama",
    descricao: "Durante a Segunda Guerra, uma jovem encontra refugio e resistencia nos livros.",
    autor: "Markus Zusak",
    faixa_etaria: "14+"
  },
  {
    imagem: "https://images.unsplash.com/photo-1511108690759-009324a90311?auto=format&fit=crop&w=600&q=80",
    titulo: "O Pequeno Principe",
    categoria: "Infantil",
    descricao: "Uma narrativa poetica sobre amizade, afeto e a forma como enxergamos o mundo.",
    autor: "Antoine de Saint-Exupery",
    faixa_etaria: "Livre"
  },
  {
    imagem: "https://images.unsplash.com/photo-1516972810927-80185027ca84?auto=format&fit=crop&w=600&q=80",
    titulo: "Sapiens",
    categoria: "Nao Ficcao",
    descricao: "Uma analise acessivel da trajetoria da humanidade da pre-historia aos tempos atuais.",
    autor: "Yuval Noah Harari",
    faixa_etaria: "16+"
  },
  {
    imagem: "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=600&q=80",
    titulo: "Mindset",
    categoria: "Desenvolvimento Pessoal",
    descricao: "Carol Dweck apresenta como crencas sobre talento e esforco afetam resultados.",
    autor: "Carol S. Dweck",
    faixa_etaria: "14+"
  },
  {
    imagem: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
    titulo: "Clean Code",
    categoria: "Tecnologia",
    descricao: "Principios e praticas para escrever codigo legivel, sustentavel e profissional.",
    autor: "Robert C. Martin",
    faixa_etaria: "16+"
  },
  {
    imagem: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
    titulo: "O Sol e para Todos",
    categoria: "Drama",
    descricao: "Uma reflexao sobre justica e preconceito a partir do olhar sensivel de uma crianca.",
    autor: "Harper Lee",
    faixa_etaria: "14+"
  },
  {
    imagem: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
    titulo: "Duna",
    categoria: "Ficcao Cientifica",
    descricao: "Conflitos politicos, religiao e ecologia se cruzam no deserto do planeta Arrakis.",
    autor: "Frank Herbert",
    faixa_etaria: "16+"
  },
  {
    imagem: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80",
    titulo: "Sherlock Holmes: Um Estudo em Vermelho",
    categoria: "Misterio",
    descricao: "A primeira investigacao da dupla Holmes e Watson em um caso cheio de pistas improvaveis.",
    autor: "Arthur Conan Doyle",
    faixa_etaria: "12+"
  },
  {
    imagem: "https://images.unsplash.com/photo-1455885666463-74a4c8f2be36?auto=format&fit=crop&w=600&q=80",
    titulo: "Extraordinario",
    categoria: "Juvenil",
    descricao: "A historia de um menino que enfrenta os desafios da escola com sensibilidade e coragem.",
    autor: "R. J. Palacio",
    faixa_etaria: "10+"
  },
  {
    imagem: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=600&q=80",
    titulo: "A Paciente Silenciosa",
    categoria: "Suspense",
    descricao: "Um crime, um silencio absoluto e uma investigacao psicologica conduzida por um terapeuta.",
    autor: "Alex Michaelides",
    faixa_etaria: "18+"
  },
  {
    imagem: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80",
    titulo: "Verity",
    categoria: "Suspense",
    descricao: "Uma escritora encontra manuscritos perturbadores ao revisar a obra inacabada de outra autora.",
    autor: "Colleen Hoover",
    faixa_etaria: "18+"
  },
  {
    imagem: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
    titulo: "Torto Arado",
    categoria: "Literatura Brasileira",
    descricao: "Duas irmas vivem os conflitos da terra, da ancestralidade e da desigualdade no sertao baiano.",
    autor: "Itamar Vieira Junior",
    faixa_etaria: "16+"
  }
];

async function seedInitialData() {
  const existingAdmin = await get(
    "SELECT id FROM usuarios WHERE email = ?",
    [initialUser.email]
  );

  if (!existingAdmin) {
    await run(
      "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
      [initialUser.nome, initialUser.email, initialUser.senha]
    );
  }

  const bookCount = await get("SELECT COUNT(*) AS total FROM livros");

  if (bookCount.total === 0) {
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
  }
}

module.exports = {
  seedInitialData
};
