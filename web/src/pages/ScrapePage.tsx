import { useMemo, useState } from "react";
import { ScrapeButton } from "../components/ScrapeButton";
import { ResultCard } from "../components/ResultCard";
import type { Product } from "../types/product";
import type { ScrapeResponse } from "../types/api";
import { Loader } from "../components/Loader";

export default function ScrapePage() {
  const target = useMemo(
      () =>
        "https://www.guitarcenter.com/search?filters=categories.lvl0:Guitars&Ntt=charvel%20san%20dimas&Ns=pLH",
      []
  );
  const [loading, setLoading] = useState(false);
  // const [msg, setMsg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  const runScrape = async () => {
    setLoading(true);
    setError(null);
    // setMsg("");

    try {
      const res = await fetch(`/api/scrape?url=${encodeURIComponent(target)}`);
      // setMsg(`Status: ${res.status} ${res.statusText}`);

      // Check if the response is JSON before parsing
      const contentType = res.headers.get("Content-Type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        setError(`Expected JSON response but got: ${text}`);
        return;
      }

      const data = (await res.json()) as ScrapeResponse;

      setProducts(data.products);
      console.log("Scraped products:", data.products);
      } catch (error) {
        setError(String(error));
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    return (
      <>
        {loading? (<Loader />) : (<ScrapeButton loading={loading} onClick={runScrape} />)}
        {/* {msg && <div id="msg" style={{ marginBottom: 12 }}>{msg}</div>} */}
        {error && (<div>{error}</div>)}
        <div>
          {products.map((product) => (
            <ResultCard key={product.skuId} product={product} />
          ))}
        </div>
      </>
    );
}