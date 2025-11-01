// 🔤 Función auxiliar
// 🔤 Función auxiliar
function toCamelCase(str) {
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");
}

export default function groupByPlayer(data) {
  const grouped = {};

  data.forEach(item => {
    const { name, team, against, market, line, overOdd, underOdd, gameId, status } = item;

    const cleanMarket = toCamelCase(
      market
        .replace(/\(\+\/-\)/g, "")
        .replace(/O\/U/gi, "")
        .replace(/&/g, " ")
        .replace(/[^\w\s]/g, "")
        .trim()
    );

    if (!grouped[name]) {
      grouped[name] = { name, team, against, gameId, status };
    }

    grouped[name][cleanMarket] = {
      line: parseFloat(line),
      overOdd: parseFloat(overOdd),
      underOdd: parseFloat(underOdd)
    };
  });

  return Object.values(grouped);
}