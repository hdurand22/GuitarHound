type ScrapeButtonProps = {
  loading: boolean;
  onClick: () => void;
};

export function ScrapeButton({ loading, onClick }: ScrapeButtonProps) {
  return (
    <button onClick={onClick} disabled={loading}>
      {loading ? "Hounding..." : "Search"}
    </button>
  );
}