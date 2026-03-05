import { load } from "cheerio";

export type Source =
  | "guitarcenter"
  | "reverb"
  | "musiciansfriend"
  | "sweetwater";

export type Product = {
  source: Source;
  name: string;
  price: string;
  priceCents?: number;
  url: string;
  image: string;
  skuId?: string;
};

export function priceToCents(priceText: string): number {
  const cleaned = priceText.replace(/[^0-9.]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? Math.round(n * 100) : Number.MAX_SAFE_INTEGER;
}

export function makeNormalizer(base: string) {
  return function normalizeURL(href: string) {
    if (!href) return "";
    if (/^https?:\/\//i.test(href)) return href;
    if (href.startsWith("/")) return `${base}${href}`;
    return `${base}/${href}`;
  };
}

export async function fetchHtml(url: string) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari",
      Accept: "text/html,application/xhtml+xml",
    },
  });
  const html = await res.text();
  return { res, html, $: load(html) };
}
