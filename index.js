import fs from "fs/promises";

import scrapeNBAScoresHTML from './getTodayGames.js';
import getPlayerNames from './getPlayerNames.js';
import mapper from './mapperData.js';
import groupByPlayer from './groupByPlayer.js';
import getlastFiveComplete from './getLastFiveComplete.js';
import transformPlayers from './orderData.js';
import uploadJsonToMongo from './uploadToMongo.js';
import addFullStats from './green.js';
import addGameId from './addGameId.js'
import enrichPlayers from './enrichPlayers.js'
import attachDvpToMarkets from './attachMArketstoDvp.js'

async function index() {
        console.log("index scrap")
        const gamesData = await scrapeNBAScoresHTML();
        const gamesContent = await getPlayerNames();
        const playerOdds = await mapper(gamesContent, gamesData);
        await fs.writeFile(`01-playerOdds.json`, JSON.stringify(playerOdds, null, 2)   );
        const PlayerOddsGroup = await groupByPlayer(playerOdds)
        await fs.writeFile(`02-PlayerOddsGroup.json`, JSON.stringify(PlayerOddsGroup, null, 2)   );
        const playerComplete = await getlastFiveComplete(PlayerOddsGroup)
        await fs.writeFile(`03-playerComplete.json`, JSON.stringify(playerComplete, null, 2)   );
        const playerTransform = await transformPlayers(playerComplete)
        await fs.writeFile(`04-group.json`, JSON.stringify(playerTransform, null, 2));
        const fullStatsPlayers = addFullStats(playerTransform);
        await fs.writeFile(`05-green.json`, JSON.stringify(fullStatsPlayers, null, 2));
        const playerWithGameId = addGameId(    fullStatsPlayers, gamesContent   ) 
        await fs.writeFile(`06-playerWithGameId.json`, JSON.stringify(playerWithGameId, null, 2)   );
        const enrichPlayersData = enrichPlayers(playerWithGameId)
        await fs.writeFile(`07-enrich.json`, JSON.stringify(enrichPlayers, null, 2)   );
        const attach = attachDvpToMarkets(enrichPlayersData)
        await fs.writeFile(`08-attach.json`, JSON.stringify(attach, null, 2)   );

        await uploadJsonToMongo(attach, gamesData,"players","games");
}









index();