import puppeteer from 'puppeteer';

export default async function getPlayerNames() {
    const url = `https://lexfitcode.github.io/dummieweb/basketball/20251031`;
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(url,{ waitUntil: 'domcontentloaded', timeout: 60000 });
        
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
        return gamesContent; 

    } catch (error) {
        console.error('An error occurred during scraping:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}