import type { Request, Response } from "express";
import { scrapeGuitarCenter } from "./scrape/guitarcenter";
import { load } from "cheerio";

const SOURCES = [{ source: "guitarcenter" as const, run: scrapeGuitarCenter }];

export const notFoundHandler = (req: Request, res: Response) => {
  res.sendStatus(404);
};

export const helloHandler = (req: Request, res: Response) => {
  const keyword =
    typeof req.query.keyword === "string" ? req.query.keyword : null;
  res.status(200).send(keyword ? `Hello, ${keyword}` : "Hello");
};

export const newUrlHandler = (req: Request, res: Response) => {
  const message = req.params.message ?? "(No Message)";
  res.send(`Hello, ${message}`);
};

export const scrapeHandler = async (req: Request, res: Response) => {
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  if (!q) {
    return res
      .status(400)
      .json({ ok: false, error: "Missing 'q' query parameter" });
  }

  const settled = await Promise.allSettled(
    SOURCES.map(async (source) => {
      const products = await source.run(q);
      return { source: source.source, products };
    }),
  );

  const results = settled.map((result, index) => {
    const source = SOURCES[index].source;
    if (result.status === "fulfilled") return result.value;
    return { source, products: [], error: String(result.reason) };
  });

  return res.status(200).json({ ok: true, query: q, results });
};

export const defaultHandler = async (req: Request, res: Response) => {
  const fullUrl = new URL(
    req.originalUrl || "/",
    `http://${req.headers.host ?? "localhost"}`,
  );
  console.log(`==== HTTP Method: ${req.method}, URL: ${fullUrl.toString()}`);
  fullUrl.searchParams.forEach((val, key) =>
    console.log(`Search param: ${key}: ${val}`),
  );
  res.sendStatus(404);
};
