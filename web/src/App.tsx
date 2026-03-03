import { useMemo, useState } from "react";
import "./App.css";

export default function App() {
  const target = useMemo(
    () =>
      "https://www.guitarcenter.com/search?filters=categories.lvl0:Guitars&Ntt=charvel%20san%20dimas&Ns=pLH",
    []
  );

  const [msg, setMsg] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const sendReq = async () => {
    setLoading(true);
    setMsg("");
    setBody("");

    try {
      const response = await fetch(
        `/api/scrape?url=${encodeURIComponent(target)}`
      );

      setMsg(`${response.status} ${response.statusText}`);

      // Your API returns JSON
      const data: unknown = await response.json();
      const pretty = JSON.stringify(data, null, 2);

      console.log(`Data: ${pretty}`);
      setBody(pretty);
    } catch (e) {
      const err = String(e);
      setMsg(`Request failed`);
      setBody(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-4">
      <button
        className="btn btn-primary my-2"
        onClick={sendReq}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Request"}
      </button>

      <div id="msg" style={{ marginBottom: 12 }}>
        {msg}
      </div>

      <pre
        id="body"
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          margin: 0,
        }}
      >
        {body}
      </pre>
    </div>
  );
}