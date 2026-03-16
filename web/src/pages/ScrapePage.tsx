import { useState } from "react";
import { ScrapeButton } from "../components/ScrapeButton";
import { ResultCard } from "../components/ResultCard";
import type { Product } from "../types/product";
import type { ScrapeResponse } from "../types/api";
import { Loader } from "../components/Loader";

export default function ScrapePage() {
  const query = "Charvel San Dimas"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<ScrapeResponse["results"]>([]);

  const runScrape = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/scrape?q=${encodeURIComponent(query)}`);
      // Check if the response is JSON before parsing
      const contentType = res.headers.get("Content-Type") || "";
      if (!contentType.includes("application/json")) {
        const text = await res.text();
        setError(`Expected JSON response but got: ${text}`);
        return;
      }

      const data = (await res.json()) as ScrapeResponse;

      setProducts(data.results);
      console.log("Scraped products:", data.results);
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
      {error && (<div>{error}</div>)}
      {products.map((group) => (
        <div key={group.source} style={{ marginTop: 16 }}>
          <h3 style={{ marginBottom: 8 }}>{group.source}</h3>
          {group.error && <div style={{ color: "crimson" }}>{group.error}</div>}

          <div className="row">
            {group.products.map((product: Product) => (
              <div key={product.skuId ?? product.url} className="col-md-4">
                <ResultCard product={product} />
              </div>
            ))}
          </div>
        </div>
      ))}
      </>
    );
}