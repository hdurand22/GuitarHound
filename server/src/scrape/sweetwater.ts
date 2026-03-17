import type { Product } from "./shared";
import { createBrowserSession, makeNormalizer } from "./shared";

const SW_BASE = "https://www.sweetwater.com/";
const normalizeSW = makeNormalizer(SW_BASE);

function buildSWUrl(query: string) {
  const url = new URL("/store/search", SW_BASE);
  url.searchParams.set("s", query.trim());
  url.searchParams.set("sb", "low2high");
  return url.toString();
}

export async function scrapeSweetwater(query: string): Promise<Product[]> {
  const { page, close } = await createBrowserSession();

  try {
    const url = buildSWUrl(query);
    console.log("[server] [api] Sweetwater URL:", url);

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    await page.waitForTimeout(3000);

    console.log("[server] [api] Sweetwater title: ", await page.title());
    console.log("[server] [api] Sweetwater body preview: ", (await page.locator("body").innerText()).slice(0, 500));

    await page.waitForSelector('[data-testid="product_grid_item"], [data-itemid]', {
      state: "attached",
      timeout: 30000,
    });

    const products = await page.$$eval(
      '[data-testid="product_grid_item"]',
      (cards) =>
        cards.slice(0, 10).map((card) => {
          const skuId = card.getAttribute("data-itemid") ?? undefined;

          const productLink =
            card.querySelector('a[data-testid="product_link"]') ??
            card.querySelector('a[data-testid="product_image"]');

          const href = productLink?.getAttribute("href") ?? "";

          const name =
            card
              .querySelector('a[data-testid="product_link"] h2')
              ?.textContent?.trim() ??
            productLink?.getAttribute("data-title")?.trim() ??
            "";

          const price =
            card
              .querySelector('a[class*="product_grid__pricing"]')
              ?.textContent?.replace(/\s+/g, "")
              .trim() ?? "";

          const imageCandidates = Array.from(
            card.querySelectorAll<HTMLImageElement>('a[data-testid="product_image"] img')
          )
            .map((img) => img.getAttribute("src") ?? "")
            .reverse();

          const image =
            imageCandidates.find((src) => /^https?:\/\//i.test(src)) ?? "";

          return {
            source: "sweetwater" as const,
            skuId,
            name,
            price,
            href,
            image,
          };
        })
    );

    const normalized: Product[] = products
      .map((p): Product => ({
        source: "sweetwater",
        skuId: p.skuId,
        name: p.name,
        price: p.price,
        url: normalizeSW(p.href),
        image: p.image,
      }))
      .filter((p) => p.name && p.price && p.url);

    console.log("[server] [api] Sweetwater product count:", normalized.length);
    console.log("[server] [api] Sweetwater products:", normalized);

    return normalized;
  } finally {
    await close();
  }
}