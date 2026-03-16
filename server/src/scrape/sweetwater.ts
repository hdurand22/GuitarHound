import type { Product } from "./shared";
import { fetchHtml, makeNormalizer } from "./shared";

const SW_BASE = "https://www.sweetwater.com/";
const normalizeSW = makeNormalizer(SW_BASE);

function buildSWUrl(query: string) {
  const url = new URL("/store/search", SW_BASE);
  url.searchParams.set("s", query.trim());
  url.searchParams.set("sb", "low2high"); // Sort by price low to high
  return url.toString();
}

export async function scrapeSweetwater(query: string): Promise<Product[]> {
  const url = buildSWUrl(query);

  const { $, res, html } = await fetchHtml(url);
  console.log("has product_grid_item:", html.includes('data-testid="product_grid_item"'));
  console.log("has product_link:", html.includes('data-testid="product_link"'));
  console.log("has /store/detail/:", html.includes('/store/detail/'));
  console.log("has pricing class:", html.includes('product_grid__pricing'));
  if (!res.ok) throw new Error(`Sweetwater HTTP ${res.status}`);

  const cards = $('[data-testid="product_grid_item"]');
  console.log("Sweetwater status: ", res.status);
  console.log("Sweetwater URL: ", url);
  console.log("Sweetwater HTML length: ", html.length);
  console.log("Sweetwater card count: ", cards.length);
  console.log("Sweetwater title preview: ", $("title").text().trim());
  console.log("Sweetwater body preview: ", $("body").text().slice(0, 500));

  const products = $('[data-testid="product_grid_item"]')
    .slice(0, 5) // Limit to first 5 products to reduce noise
    .map((_, el) => {
      const skuId = $(el)
        .attr("data-itemid") ?? undefined;
      const name = $(el).find("h2").first().text().trim();
      const href = $(el).find("a").first().attr("href") ?? "";
      const url = normalizeSW(href);
      const price = $(el).text().match(/\$[\d,]+(?:\.\d{2})?/)?.[0] ?? "";
      const image = $(el)
        .find('a[data-testid="product_image"] img')
        .toArray()
        .map((img) => $(img).attr("src") ?? "")
        .reverse()
        .find((src) => /^https?:\/\//i.test(src)) ?? "";
      const img = normalizeSW(image);

      return {
        source: "sweetwater" as const,
        skuId,
        name,
        price,
        url: url,
        image: img,
      };
    })
    .get()

    console.log("Sweetwater raw products:", products);

  return products.filter((p) => p.name && p.url && p.price);
}
