import type { Product } from "../types/product";
import styles from "../styles/ResultCard.module.css";

type ResultCardProps = {
  product: Product;
};

export function ResultCard({ product }: ResultCardProps) {
  return (
    <div className="card w-96 bg-base-100 shadow-xl m-4">
      <figure>
        <img src={product.image} alt={product.name} />
      </figure>
      <div className="card-body">
        <h2 className={styles.cardTitle}>{product.name}</h2>
        <p>{product.price}</p>
        <div className="card-actions justify-end">
          <a href={product.url} target="_blank" rel="noopener noreferrer">
            View Product
          </a>
        </div>
      </div>
    </div>
  );
}