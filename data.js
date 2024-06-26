const nowDateTime = new Date();
const opcoes = {
  timeZone: "America/Sao_Paulo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
};

const nowDateTimeInBrazil = nowDateTime
  .toLocaleString("sv-SE", opcoes)
  .replace("T", " ");
console.log(nowDateTimeInBrazil); // Formato: YYYY-MM-DD HH:MM:SS
