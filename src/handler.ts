import type { Request, Response } from "express";
import { load } from "cheerio";

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
  console.log("SCRAPE HANDLER FILE:", __filename);
  const urlParam = typeof req.query.url === "string" ? req.query.url : "";
  if (!urlParam) {
    res.status(400).json({ ok: false, error: "Missing 'url' query parameter" });
    return;
  }

  let target: URL;
  try {
    target = new URL(urlParam);
  } catch {
    res.status(400).json({ ok: false, error: "Invalid URL" });
    return;
  }

  try {
    const response = await fetch(target.toString()); // Go to URL and get the HTML content
    const html = await response.text(); // Convert the response to text (HTML)

    // Parse the HTML using Cheerio to extract the title, first paragraph, and first link
    const $ = load(html);
    const title = $("h1").first().text();
    const text = $("p").first().text();
    const link = $("a").first().attr("href") ?? null;

    // Create a JSON response with the extracted data and send it back to the client
    res.status(200).json({
      ok: true,
      status: response.status,
      url: target.toString(),
      title,
      text,
      link,
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "string"
          ? err
          : JSON.stringify(err);

    const cause =
      err instanceof Error && "cause" in err
        ? (err as { cause?: unknown }).cause
        : undefined;

    console.error("SCRAPE ERROR:", err);

    // If something already responded
    if (res.headersSent) return;

    return res.status(500).json({
      ok: false,
      error: message,
      cause:
        cause instanceof Error
          ? cause.message
          : typeof cause === "string"
            ? cause
            : cause
              ? JSON.stringify(cause)
              : undefined,
    });
  }
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
