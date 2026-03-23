const bannedTerms = new Set([
  "arrombado",
  "bosta",
  "buceta",
  "cacete",
  "caralho",
  "corno",
  "cu",
  "desgraca",
  "fdp",
  "foda",
  "foder",
  "merda",
  "otario",
  "pau",
  "piranha",
  "piroca",
  "porra",
  "puta",
  "putaria",
  "puto",
  "rola",
  "vagabunda",
  "viado",
  "gay"
]);

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

function findBannedTerm(value) {
  if (typeof value !== "string") {
    return null;
  }

  const tokens = tokenizeText(value);

  for (const token of tokens) {
    if (bannedTerms.has(token)) {
      return token;
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
