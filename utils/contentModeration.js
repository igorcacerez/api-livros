const bannedTerms = [
  "arrombado",
  "arrombada",
  "ass",
  "asshole",
  "babaca",
  "bastard",
  "bastardo",
  "besta",
  "bitch",
  "blowjob",
  "boquete",
  "bosta",
  "bucetao",
  "bullshit",
  "buceta",
  "cacete",
  "caralho",
  "carai",
  "corno",
  "crap",
  "cretino",
  "cunt",
  "cu",
  "damn",
  "desgraca",
  "desgracado",
  "desgracada",
  "dick",
  "dildo",
  "douche",
  "douchebag",
  "escroto",
  "fdp",
  "feladaputa",
  "filhadaputa",
  "filhodeputa",
  "fuck",
  "fucker",
  "fucking",
  "foda",
  "foder",
  "gozar",
  "horny",
  "idiota",
  "imbecil",
  "jackass",
  "jerk",
  "kct",
  "krl",
  "lixo",
  "merda",
  "motherfucker",
  "otario",
  "palhaco",
  "pau",
  "penis",
  "pervertido",
  "pica",
  "piranha",
  "piroca",
  "piss",
  "porra",
  "prick",
  "punheta",
  "puta",
  "putaria",
  "puto",
  "retardado",
  "rola",
  "sacanagem",
  "safada",
  "safado",
  "shit",
  "sonofabitch",
  "slut",
  "stupid",
  "sucker",
  "tesao",
  "vaca",
  "vagabunda",
  "vagabundo",
  "vsf",
  "wanker",
  "wtf",
  "whore"
];

const exactMatchTerms = new Set(bannedTerms);
const embeddedMatchTerms = [...new Set(bannedTerms)]
  .filter((term) => term.length >= 4)
  .sort((firstTerm, secondTerm) => secondTerm.length - firstTerm.length);

function normalizeText(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function tokenizeText(value) {
  return normalizeText(value)
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function compactText(value) {
  return normalizeText(value).replace(/[^a-z0-9]+/g, "");
}

function findBannedTerm(value) {
  if (typeof value !== "string") {
    return null;
  }

  const tokens = tokenizeText(value);

  for (const token of tokens) {
    if (exactMatchTerms.has(token)) {
      return token;
    }
  }

  const compactValue = compactText(value);

  for (const term of embeddedMatchTerms) {
    if (compactValue.includes(term)) {
      return term;
    }
  }

  return null;
}

function validateFieldsForProfanity(fields) {
  for (const [fieldName, value] of Object.entries(fields)) {
    const bannedTerm = findBannedTerm(value);

    if (bannedTerm) {
      return {
        field: fieldName,
        term: bannedTerm
      };
    }
  }

  return null;
}

module.exports = {
  validateFieldsForProfanity
};
