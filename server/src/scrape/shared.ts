import { chromium, type Browser, type BrowserContext, type Page } from "playwright";

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

type BrowserSession = {
  browser: Browser;
  context: BrowserContext;
  page: Page;
  close: () => Promise<void>;
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
    const cleanBase = base.replace(/\/$/, "");
    if (href.startsWith("/")) return `${cleanBase}${href}`;
    return `${cleanBase}/${href}`;
  };
}

export async function createBrowserSession(): Promise<BrowserSession> {
  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    viewport: { width: 1440, height: 1200 },
    locale: "en-US",
  });

  const page = await context.newPage();

  return {
    browser,
    context,
    page,
    close: async () => {
      await page.close();
      await context.close();
      await browser.close();
    },
  };
}

export async function gotoAndWait( page: Page, url: string) {
  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 45000,
  });

  await page.waitForLoadState("networkidle").catch(() => {});
}
