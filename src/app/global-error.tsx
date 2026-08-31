"use client";

/**
 * Last line of defence: this replaces the root layout, so it cannot rely on
 * fonts, tokens, dictionaries or anything else the app provides. Everything
 * here is inline on purpose — if this page needs a stylesheet to render, it
 * has already failed at its job.
 */
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="sk">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#0b0c11",
          color: "#eeeff4",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          padding: "24px",
        }}
      >
        <main style={{ maxWidth: "44ch" }}>
          <div style={{ display: "flex", gap: 6 }} aria-hidden>
            <span style={{ width: 4, height: 24, borderRadius: 999, background: "#6e8fc4" }} />
            <span style={{ width: 4, height: 24, borderRadius: 999, background: "#46618f" }} />
            <span style={{ width: 4, height: 24, borderRadius: 999, background: "#2a3a55" }} />
          </div>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", margin: "32px 0 0", lineHeight: 1.1 }}>
            Niečo sa pokazilo.
          </h1>
          <p style={{ color: "#a2a8b6", lineHeight: 1.6, marginTop: 16 }}>
            Nastala neočakávaná chyba. Skúste to znova alebo mi napíšte na{" "}
            <a href="mailto:ktenorstudio@gmail.com" style={{ color: "#6e8fc4" }}>
              ktenorstudio@gmail.com
            </a>
            .
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 32,
              cursor: "pointer",
              border: 0,
              borderRadius: 8,
              background: "#eeeff4",
              color: "#0b0c11",
              padding: "14px 28px",
              font: "inherit",
              fontWeight: 500,
            }}
          >
            Skúsiť znova
          </button>
        </main>
      </body>
    </html>
  );
}
