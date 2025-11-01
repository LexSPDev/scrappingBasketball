import fs from "fs/promises";
/**
 * Transforma un array de jugadores del formato original al nuevo formato
 * @param {Array} playersArray - Array con los datos originales de los jugadores
 * @returns {Array} Array transformado con el nuevo formato
 */

export default function transformPlayers(playersArray) {

const statTranslations = {
  points: "points",
  puntos: "points",
  assists: "assists",
  asistencias: "assists",
  rebounds: "rebounds",
  rebotes: "rebounds",
  pointsAssists: "pointsAssists",
  pointsRebounds: "pointsRebounds",
  assistsRebounds: "assistsRebounds",
  pointsAssistsRebounds: "pointsAssistsRebounds",
  puntosYAsistencias: "pointsAssists",           // ✅ Agregado
  puntosYRebotes: "pointsRebounds",              // ✅ Agregado
  asistenciasYRebotes: "assistsRebounds",        // ✅ Agregado
  puntosAsistenciasYRebotes: "pointsAssistsRebounds"
};

  const extractStatArray = (games = {}, stat) => {
    const key = statTranslations[stat];
    if (!key) return {};

    const result = {};
    Object.entries(games || {}).forEach(([i, g]) => {
      const pts = Number(g.pts) || 0;
      const reb = Number(g.reb) || 0;
      const ast = Number(g.ast) || 0;

      const valueMap = {
        points: pts,
        assists: ast,
        rebounds: reb,
        pointsAssists: pts + ast,
        pointsRebounds: pts + reb,
        assistsRebounds: ast + reb,
        pointsAssistsRebounds: pts + ast + reb
      };

      result[i] = { date: g.date, value: valueMap[key] || 0 };
    });

    return result;
  };

  const marketKeys = [
    "points",
    "assists",
    "rebounds",
    "pointsAssists",
    "pointsRebounds",
    "assistsRebounds",
    "pointsAssistsRebounds"
  ];

  return playersArray.map(player => {
    const markets = {};

    marketKeys.forEach(key => {
      // Busca la clave correcta en el jugador original (español o inglés)
      const dataKey = Object.keys(statTranslations).find(k => statTranslations[k] === key && player[k]);
      const data = dataKey ? player[dataKey] : { line: 0, overOdd: 1.8, underOdd: 1.8 };

      markets[key] = {
        line: data.line,
        overOdd: data.overOdd,
        underOdd: data.underOdd,
        lastFive: extractStatArray(player.lastFive?.games, key),
        lastAgainst: extractStatArray(player.LastAgainst?.games, key),
        lastFiveStatus: extractStatArray(player.lastFiveStatus?.games, key),
        lastAgainstStatus: extractStatArray(player.lastFiveAgainstStatus?.games, key)
      };
    });

    return {
      name: player.name,
      team: player.team,
      opponent: player.against,
      status : player.status,
      markets
    };
  });
}
/*const tp = transformPlayers(playerArray)
await fs.writeFile(`04-group.json`, JSON.stringify(tp, null, 2));*/