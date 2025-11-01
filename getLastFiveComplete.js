import getDataFromWeb from './getLastFive.js';
import getDataFromWebVs from './getLastFiveAgainst.js';

export default async function getlastFiveComplete(data){
  for(let i = 0 ; i < data.length ; i++) {
      console.log(data[i])
        let url
        const item = data[i]
        const status = item.status
        const nameForSearch = item.name.replace(" ", "-")
        item.lastFive = await getDataFromWeb(`https://www.statmuse.com/nba/ask/${nameForSearch}-last-5-games` )
        item.lastFiveStatus = await getDataFromWeb(`https://www.statmuse.com/nba/ask/${nameForSearch}-last-5-games-${status}` )

        
        if(data[i].against !== null){
          const against = data[i].against
          item.lastFiveAgainstStatus = await getDataFromWeb(`https://www.statmuse.com/nba/ask/${nameForSearch}-last-5-games-vs-${against}-${status}` )
          item.LastAgainst = await getDataFromWeb(`https://www.statmuse.com/nba/ask/${nameForSearch}-last-5-games-vs-${against}`)
        } else {
          item.LastAgainst = { error: "Rival not found" }
          item.lastFiveAgainstStatus = { error: "Rival not found" }
        }
        console.log(item)
    }
    return data
}


