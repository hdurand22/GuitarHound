import type { Product } from "./product";

export type Source = "guitarcenter" | "reverb" | "musiciansfriend" | "sweetwater";

export type SourceResult = {
  source: Source;
  products: Product[];
  error?: string;
};

export type ScrapeResponse = {
  ok: true;
  query: string;
  results: SourceResult[];
};