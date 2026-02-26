// To run this script, copy and paste 'node scraper-js.js' into your terminal

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { load } from "cheerio";

(async () => {
  const url = "https://www.example.com/";
  const response = await fetch(url);

  const $ = load(await response.text());
  const title = $("h1").text();
  const text = $("p").text();
  const link = $("a").attr("href");
  console.log(title);
  console.log(text);
  console.log(link);
  console.log($.html());
})();
