import type { Product } from "./shared";
import { createBrowserSession, gotoAndWait, makeNormalizer } from "./shared";

const GC_BASE = "https://www.guitarcenter.com";
const normalizeGC = makeNormalizer(GC_BASE);

function buildGCUrl(query: string) {
  const url = new URL("/search", GC_BASE);
  url.searchParams.set("Ntt", query.trim());
  url.searchParams.set("Ns", "pLH");
  return url.toString();
}

export async function scrapeGuitarCenter(query: string): Promise<Product[]> {
  const { page, close } = await createBrowserSession();

  try {
    const url = buildGCUrl(query);
    console.log("[server] [api] Guitar Center URL:", url);

    await gotoAndWait(page, url);

    await page.waitForSelector("[data-product-sku-id]", {
      timeout: 20000,
    });

    const products = await page.$$eval("[data-product-sku-id]", (cards) =>
      cards.slice(0, 5).map((card) => {
        const skuId = card.getAttribute("data-product-sku-id") ?? undefined;

        const name =
          card.querySelector("h2")?.textContent?.trim() ?? "";

        const href =
          card.querySelector('a[href*=".gc"]')?.getAttribute("href") ?? "";

        const price =
          card.querySelector(".sale-price")?.textContent?.trim() ?? "";

        const image =
          card.querySelector("img")?.getAttribute("src") ?? "";

        return {
          skuId,
          name,
          price,
          href,
          image,
        };
      })
    );

    const normalized: Product[] = products
      .map(
        (p): Product => ({
          source: "guitarcenter",
          skuId: p.skuId,
          name: p.name,
          price: p.price,
          url: normalizeGC(p.href),
          image: p.image ? normalizeGC(p.image) : "",
        })
      )
      .filter((p) => p.name && p.url && p.price);

    console.log("[server] [api] Guitar Center product count:", normalized.length);
    console.log("[server] [api] Guitar Center products:", normalized);

    return normalized;
  } finally {
    await close();
  }
}