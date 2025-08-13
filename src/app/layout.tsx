import "./globals.css";

import NavBar from "./components/NavBar";
export const metadata = {
  title: "Site Fetcher",
  description: "Fetch and preview website HTML",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",
        }}
      >
        <header
          style={{
            padding: "15px 40px",
            background: "#1a1a2e",
            color: "#eaeaea",
            display: "flex",
            alignItems: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            position: "sticky",
            top: 0,
            zIndex: 1000,
          }}
        >
          <NavBar />
        </header>

        <main style={{ padding: "30px", minHeight: "calc(100vh - 70px)" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
