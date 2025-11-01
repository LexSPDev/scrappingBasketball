
export default function addGameId(baseArray, marketsArray) {
  return baseArray.map(player => {
    // Buscar el jugador correspondiente en el segundo array
    const found = marketsArray.find(m => m.name === player.name);

    // Si se encuentra, se agrega el gameId
    if (found) {
      return {
        ...player,
        gameId: found.gameId
      };
    }

    // Si no se encuentra, se devuelve igual
    return player;
  });
}
