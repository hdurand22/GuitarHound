import loaderImage from "../assets/pointer.png";
import "../styles/Loader.css";

type LoaderProps = {
  label?: string;
};

export function Loader({ label = "Hounding..." }: LoaderProps) {  
  return (
    <div className="loader">
      <div className="loader-wipeFrame" aria-label={label}>
        <div className="loader-wipe">
          <img src={loaderImage} alt={label} className="loader-image" />
        </div>
      </div>
      <div className="loader-label">{label}</div>
    </div>
  );
};