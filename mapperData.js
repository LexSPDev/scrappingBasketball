export default async function mapper(market, gamesData) {
    let playerOdd = []
    let name
    let line
    let overOdd
    let underOdd
    let team
    let against
    let playerKit
    let gameId
    let status
    for(let i = 0 ; i <  market.length; i++){
        //
        for(let j = 0 ; j < market[i].playerContent.length ; j++){
            if(market[i].playerContent.length > 0){
                name  =market[i].playerContent[j].playerName
                line = market[i].singleOddsOverOne[j].singleOddOverLine
                overOdd = market[i].singleOddsOverOne[j].singleOddOverOdd
                underOdd = market[i].singleOddsUnderOne[j].singleOddUnderOdd
                console.log("Processing player:", name, market[i].playerContent[j]);
                playerKit=  market[i].playerContent[j].playerKit
                team = extractTeamName(market[i].playerContent[j].playerKit) 
                console.log(team)
                against = getRivalName(team, gamesData)
                status = getRivalStatus(team, gamesData)
                gameId = getGameId(team, gamesData)
                playerOdd.push({market: market[i].marketsContent,name,team,against, line,overOdd,underOdd, playerKit,  gameId, status})
            }
        }
    }
    return playerOdd
}

function extractTeamName(url) {
  // Obtener el nombre del archivo
  const fileName = url.split('/').pop();

  // Quitar todas las extensiones .svg (una o varias)
  const nameWithoutExt = fileName.replace(/(\.svg)+$/i, "");

  // Separar por guiones bajos o espacios
  const parts = nameWithoutExt.split(/[_\s]+/);

  // Eliminar la primera parte (abreviación de 3 letras)
  parts.shift();

  // Palabras que queremos ignorar
  const ignoreWords = [
    'Icon', 'Rear', 'Association', 'City', 'Home', 'Away', 'Statement'
  ];

  // Filtrar palabras conocidas y números aislados (como "25")
  const teamParts = parts.filter(
    part => !ignoreWords.includes(part) && !/^\d+$/.test(part)
  );

  // Unir el resto con espacio
  let teamName = teamParts.join(' ');

  // Eliminar números sueltos al final del nombre (no parte del equipo)
  teamName = teamName.replace(/\b(\d+)\b$/g, '');

  // Limpiar espacios sobrantes
  teamName = teamName.trim();

  // Devolver con la primera letra en mayúscula
  return teamName.replace(/\b\w/g, l => l.toUpperCase());
}

function getRivalStatus(team, gamesData){
      console.log("Finding rival for team:", team);
    console.log(gamesData)
    const match = gamesData.find(
    g => g.homeTeamName === team || g.awayTeamName === team
  );
  if (!match) return null;
  return match.homeTeamName === team ? "away" : "home"
}

function getRivalName(team, gamesData) {
    console.log("Finding rival for team:", team);
    console.log(gamesData)
    const match = gamesData.find(
    g => g.homeTeamName === team || g.awayTeamName === team
  );
  if (!match) return null;
  return match.homeTeamName === team ? match.awayTeamName : match.homeTeamName;
}

function getGameId(team, gamesData) {
    console.log("Finding rival for team:", team);
    console.log(gamesData)
    const match = gamesData.find(
    g => g.homeTeamName === team || g.awayTeamName === team
  );
  if (!match) return null;
  return match.id;
}