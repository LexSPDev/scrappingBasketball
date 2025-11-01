import puppeteer from "puppeteer";
import fs from "fs/promises";

export default async function getDataFromWebVs(name, rivalName) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();
    const url = `https://www.statmuse.com/nba/ask/${name}-last-5-games-vs-${rivalName}`;

    console.log("Fetching:", url);

    await page.goto(url,{ waitUntil: "domcontentloaded", timeout: 90000 });

    const result = await page.evaluate(() => {
      try {
        const table = document.querySelector(
          "body > div.grid.grid-rows-1.gap-3.\\[--top-spacing\\:62px\\].flex-1.md\\:grid-cols-\\[1fr_300px\\].xl\\:grid-cols-\\[auto_1fr_300px\\] > div.min-w-0.h-full > div.content.flex.flex-col.gap-3 > div:nth-child(2) > div.flex-1.overflow-x-auto > astro-island > div > div > table > tbody"
        );

        if (!table) throw new Error("Table not found");

        const rows = table.querySelectorAll("tr");
        const dataRows = rows.length - 1;

        const att =
          "body > div.grid.grid-rows-1.gap-3.\\[--top-spacing\\:62px\\].flex-1.md\\:grid-cols-\\[1fr_300px\\].xl\\:grid-cols-\\[auto_1fr_300px\\] > div.min-w-0.h-full > div.content.flex.flex-col.gap-3 > div:nth-child(2) > div.flex-1.overflow-x-auto > astro-island > div > div > table > tbody > tr:nth-child";
          "(1) > td:nth-child(8) > span > div > span"
        const games = {};
        for (let i = 1; i < dataRows; i++) {
            const date =
                document.querySelector(att + `(${i}) > td:nth-child(4) > a > div > span`)
                    ?.innerText || "";
            const min =
                document.querySelector(att + `(${i}) > td:nth-child(8) > span > div > span`)
                    ?.innerText || "";
            const pts =
                document.querySelector(att + `(${i}) > td:nth-child(9) > span > div > span`)
                    ?.innerText || "";
            const reb =
                document.querySelector(att + `(${i}) > td:nth-child(10) > span > div > span`)
                    ?.innerText || "";
            const ast =
                document.querySelector(att + `(${i}) > td:nth-child(11) > span > div > span`)
                    ?.innerText || "";
            const triples =
                document.querySelector(att + `(${i}) > td:nth-child(17) > span > div > span`)
                    ?.innerText || "";
            const triplesattemps =
                document.querySelector(att + `(${i}) > td:nth-child(18) > span > div > span`)
                    ?.innerText || "";
          games[i] = { date, min, pts, reb, ast, triples, triplesattemps };
        }
        return { games };
      } catch (err) {
        return { error: err.message };
      }
    });

    return result;
  } catch (error) {
    console.error(`Error fetching data for ${name}: ${error.message}`);
    return { name, error: error.message };
  } finally {
    if (browser) await browser.close();
  }
}


