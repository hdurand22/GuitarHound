import type { Source } from "./api";

export type Product = {
  source: Source;
  name: string;
  price: string;
  url: string;
  image: string;
  skuId?: string;
};