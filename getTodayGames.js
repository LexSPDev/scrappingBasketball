// scraper.js (Extracting Raw HTML)

import puppeteer from 'puppeteer';
import fs from "fs/promises";
/**
 * Generates the current date in YYYYMMDD format.
 */
function getCurrentDateFormatted() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    return `${year}${month}${day}`;
}

async function scrapeNBAScoresHTML() {
    const date = getCurrentDateFormatted();
    const url = `https://www.espn.com/nba/scoreboard/_/date/${date}`;
    
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        console.log(`Navigating to NBA Scoreboard for date: ${date}`);
        await page.goto(url);

        // --- CORE SCRAPING LOGIC ---
        // Selector for the main container holding the games. 
        // Note: Using a reliable selector for the entire scoreboard section.
        const gamesContainerSelector = '.Scoreboard'; // A reliable class for the overall scoreboard wrapper
        
        const gamesContent = await page.evaluate((selector) => {
            // Find the element using the provided selector
            const gamesContainer = document.querySelector(selector);
            
            if (gamesContainer) {
                // Return the game  content of the found element
                const gameContainer = document.querySelectorAll(".Scoreboard")


                const game = [...gameContainer].map((game) => {
                    const id = game?.getAttribute("id") || "";
                    const awayTeamName = game?.querySelector(".ScoreboardScoreCell__Item--away .ScoreCell__TeamName").innerHTML
                    const homeTeamName = game?.querySelector(".ScoreboardScoreCell__Item--home .ScoreCell__TeamName").innerHTML
                    return {id, awayTeamName, homeTeamName}
                });



                return game;
            } else {
                return `Error: Could not find an element with the selector ${selector}`;
            }
        }, gamesContainerSelector);

        await fs.writeFile(`games${date}.json`, JSON.stringify(gamesContent, null, 2));

    } catch (error) {
        console.error('An error occurred during scraping:', error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

scrapeNBAScoresHTML();