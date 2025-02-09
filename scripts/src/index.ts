import puppeteer, { Page } from "puppeteer";
import * as cheerio from "cheerio";
import { readFromCsv, readFromJson, saveDataToJson } from "./helpers";
import {
  BASE_URL,
  FILE_PATH,
  QUOTE_SELECTOR,
  READ_FROM_CSV_PATH,
  READ_FROM_JSON_PATH,
} from "./constants";

async function main() {
  console.log("Starting the scraping process");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  //   Scrape all pages
  console.log("Scraping the web...");
  await ScrapeFromPage(page);

  //   Read from JSON and append to the file
  console.log("Reading from JSON...");
  readFromJson(READ_FROM_JSON_PATH, FILE_PATH);
  console.log("Reading from CSV...");
  readFromCsv(READ_FROM_CSV_PATH, FILE_PATH);

  console.log("Data scraped successfully");
}

async function ScrapeFromPage(page: Page) {
  const scrapedData: string[] = [];
  let pageNumber = 1;
  let nextPageExists = true;
  while (nextPageExists) {
    console.log(`Scraping page ${pageNumber}...`);
    await page.goto(`${BASE_URL}/page/${pageNumber}/`);

    const content = await page.content();
    const { hasNextPage } = getQuotes(content, scrapedData);
    nextPageExists = hasNextPage;
    pageNumber++;
  }
  await saveDataToJson(scrapedData, FILE_PATH);
}

function getQuotes(content: string, data: string[]) {
  const $ = cheerio.load(content);

  const quotes = $(QUOTE_SELECTOR)
    .map((_, element) => $(element).text())
    .get();

  data.push(...quotes);

  const nextPageButton = $("li.next");
  const hasNextPage = nextPageButton.length !== 0;

  return { quotes, hasNextPage };
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
