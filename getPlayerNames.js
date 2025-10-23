import puppeteer from 'puppeteer';
import fs from "fs/promises";

async function getPlayerNames() {
    const url = `https://lexfitcode.github.io/dummieweb/bo`;
    
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        console.log(`Navigating to dummieWeb`);
        await page.goto(url);
        
        const gamesContent = await page.evaluate(() => {
            // Find the element using the provided selector
            
                // Return the game  content of the found element
                const gameContainer = document.querySelectorAll(".gl-MarketGroupPod")

                const game = [...gameContainer].map((game) => {
                    const marketsContent = game.querySelector(".cm-MarketGroupWithIconsButton_Text ").innerText

                    const playerContainer = game.querySelectorAll(".srb-ParticipantLabelWithTeam")
                    
                    const playerContent  = [...playerContainer].map((player)=>{
                        const playerKit  = player.querySelector(".tk-TeamKitBackImage_SVG ").getAttribute("src")
                        const playerName = player.querySelector(".srb-ParticipantLabelWithTeam_Name ").innerText

                        return {playerKit, playerName}
                    })

                    const singleOddsOver = game.querySelectorAll(
                            ".over .odds"
                        );
                        const singleOddsOverOne = [...singleOddsOver].map((player) => {
                            const singleOddOverLine = player.querySelector('.gl-ParticipantCenteredStacked_Handicap')?.innerText
                            const singleOddOverOdd = player.querySelector('.gl-ParticipantCenteredStacked_Odds')?.innerText
                            return { singleOddOverLine, singleOddOverOdd };
                        });
                        const singleOddsUnder = game.querySelectorAll(
                            ".under .odds"
                        );
                        const singleOddsUnderOne = [...singleOddsUnder].map((player) => {
                            const singleOddUnderLine = player.querySelector('.gl-ParticipantCenteredStacked_Handicap')?.innerText
                            const singleOddUnderOdd = player.querySelector('.gl-ParticipantCenteredStacked_Odds')?.innerText
                            return { singleOddUnderLine, singleOddUnderOdd };
                        });

                    return {marketsContent,playerContent, singleOddsOverOne, singleOddsUnderOne }
                });



                return game;

        });
        const playerOdds = await mapper(gamesContent);
        await fs.writeFile(`content.json`, JSON.stringify(gamesContent, null, 2));
        await fs.writeFile(`playerNamesOdds.json`, JSON.stringify(playerOdds, null, 2));

    } catch (error) {
        console.error('An error occurred during scraping:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

async function mapper(market) {
    let playerOdd = []
    let name
    let line
    let overOdd
    let underOdd
    for(let i = 0 ; i <  market.length; i++){
        console.log(market[i].marketsContent)
        for(let j = 0 ; j <  market[i].playerContent.length; j++){
            if(market[i].playerContent.length > 0){
                name  =market[i].playerContent[j].playerName
                line = market[i].singleOddsOverOne[j].singleOddOverLine
                overOdd = market[i].singleOddsOverOne[j].singleOddOverOdd
                underOdd = market[i].singleOddsUnderOne[j].singleOddUnderOdd
                playerOdd.push({market: market[i].marketsContent,name,line,overOdd,underOdd})
            }
        }
    }
    return playerOdd
}

getPlayerNames();