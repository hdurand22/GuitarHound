import type { Product } from "./shared";
import { fetchHtml, makeNormalizer } from "./shared";

const GC_BASE = "https://www.guitarcenter.com";
const normalizeGC = makeNormalizer(GC_BASE);

function buildGCUrl(query: string) {
  const url = new URL("/search", GC_BASE);
  url.searchParams.set("Ntt", query.trim());
  url.searchParams.set("Ns", "pLH"); // Sort by price low to high
  return url.toString();
}

export async function scrapeGuitarCenter(query: string): Promise<Product[]> {
  const url = buildGCUrl(query);

  const { $, res } = await fetchHtml(url);
  if (!res.ok) throw new Error(`GuitarCenter HTTP ${res.status}`);

  const products = $("[data-product-sku-id]")
    .slice(0, 5) // Limit to first 5 products to reduce noise
    .map((_, el) => {
      const skuId = $(el)
        .attr("data-product-sku-id") ?? undefined;
      const name = $(el)
        .find("h2")
        .first()
        .text();
      const href = $(el)
        .find('a[href*=".gc"]')
        .first()
        .attr("href") ?? "";
      const url = normalizeGC(href);
      const price = $(el)
        .find(".sale-price")
        .first()
        .text();
      const image = $(el)
        .find("img")
        .first()
        .attr("src") ?? "";
      const img = normalizeGC(image);

      return {
        source: "guitarcenter" as const,
        skuId,
        name,
        price,
        url: url,
        image: img,
      };
    })
    .get()
    .filter((p) => p.name && p.url && p.price); // Basic validation

  return products;
}
