"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const STORAGE_KEY = "fetchedSiteData";

export default function HomePage() {
  const [url, setUrl] = useState<string>("");
  const [html, setHtml] = useState<string>("");
  const [assets, setAssets] = useState<{ images: string[]; css: string[]; js: string[] }>({
    images: [],
    css: [],
    js: [],
  });
  const [loading, setLoading] = useState(false);  // <-- loading state

  useEffect(() => {
    const savedData = sessionStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const { url, html, assets } = JSON.parse(savedData);
      setUrl(url);
      setHtml(html);
      setAssets(assets);
    }
  }, []);

  useEffect(() => {
    if (html) {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          url,
          html,
          assets,
        })
      );
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [url, html, assets]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      sessionStorage.removeItem(STORAGE_KEY);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const extractAssets = (html: string) => {
    if (typeof window === "undefined") return;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const images = Array.from(doc.querySelectorAll("img")).map((img) => {
      const image = img as HTMLImageElement;
      return image.src.startsWith("http") ? image.src : new URL(image.src, url).href;
    });

    const css = Array.from(doc.querySelectorAll('link[rel="stylesheet"]')).map((link) => {
      const stylesheet = link as HTMLLinkElement;
      return stylesheet.href.startsWith("http") ? stylesheet.href : new URL(stylesheet.href, url).href;
    });

    const js = Array.from(doc.querySelectorAll("script[src]")).map((script) => {
      const scriptEl = script as HTMLScriptElement;
      return scriptEl.src.startsWith("http") ? scriptEl.src : new URL(scriptEl.src, url).href;
    });

    setAssets({ images, css, js });
  };

  const fetchSite = async () => {
    setLoading(true);  // start loading
    try {
      const res = await axios.post("https://fetch-website-backend.onrender.com/fetch-site", { url });
      setHtml(res.data.html);
      extractAssets(res.data.html);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch site");
    } finally {
      setLoading(false);  // stop loading no matter what
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(html).then(() => {
      alert("HTML copied to clipboard!");
    });
  };

  const downloadHTML = () => {
    const blob = new Blob([html], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "website.html";
    link.click();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Fetch Website HTML</h1>
      <input
        type="text"
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "300px", marginRight: "10px" }}
        disabled={loading} // disable input while loading
      />
      <button onClick={fetchSite} disabled={loading}>
        {loading ? "Fetching..." : "Fetch"}
      </button>

      <h2>Preview:</h2>
      {loading ? (
        <p style={{ fontStyle: "italic" }}>Fetching website, please wait...</p>
      ) : (
        <iframe
          srcDoc={html}
          style={{
            border: "1px solid #ccc",
            marginTop: "20px",
            width: "1400px",
            height: "700px",
            background: "#fff",
          }}
          sandbox="allow-scripts allow-same-origin"
        />
      )}

      <h2>Full Code Generator (Editable):</h2>
      <textarea
        value={html}
        onChange={(e) => setHtml(e.target.value)}
        style={{
          border: "1px solid #ccc",
          padding: 15,
          marginTop: 20,
          height: 400,
          width: "100%",
          background: "#1e1e1e",
          color: "#d4d4d4",
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
        }}
        disabled={loading} // disable textarea while loading
      />

      <div style={{ marginTop: 10 }}>
        <button onClick={copyToClipboard} style={{ marginRight: 10 }} disabled={loading}>
          📋 Copy HTML
        </button>
        <button onClick={downloadHTML} disabled={loading}>
          💾 Download HTML
        </button>
      </div>

      <h2 style={{ marginTop: 30 }}>Extracted Assets</h2>

      <h3>Images ({assets.images.length}):</h3>
      <ul>
        {assets.images.map((src, i) => (
          <li key={i}>
            <a href={src} target="_blank" rel="noreferrer">
              {src}
            </a>
          </li>
        ))}
      </ul>

      <h3>CSS Files ({assets.css.length}):</h3>
      <ul>
        {assets.css.map((src, i) => (
          <li key={i}>
            <a href={src} target="_blank" rel="noreferrer">
              {src}
            </a>
          </li>
        ))}
      </ul>

      <h3>JS Files ({assets.js.length}):</h3>
      <ul>
        {assets.js.map((src, i) => (
          <li key={i}>
            <a href={src} target="_blank" rel="noreferrer">
              {src}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
