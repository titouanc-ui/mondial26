import { ImageResponse } from "next/og";

/**
 * OpenGraph / Twitter preview image générée dynamiquement à l'edge.
 * Affichée quand le site est partagé (WhatsApp, Discord, X, etc.).
 *
 * Doc Next 16 : node_modules/next/dist/docs/app/api-reference/file-conventions/metadata/opengraph-image-and-twitter-image.md
 */

export const alt = "Mondial 26 — Tout le Mondial 2026 entre potes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "linear-gradient(135deg, #4a8fff 0%, #141a2e 45%, #0a0e1a 70%, #c8102e 100%)",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "32px",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "4px",
            opacity: 0.85,
          }}
        >
          <span>⚽</span>
          <span>Mondial 26</span>
        </div>

        <div
          style={{
            marginTop: "40px",
            fontSize: "92px",
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-2px",
            maxWidth: "1000px",
          }}
        >
          Tout le Mondial 2026, entre potes.
        </div>

        <div
          style={{
            marginTop: "32px",
            fontSize: "32px",
            opacity: 0.9,
            maxWidth: "900px",
            lineHeight: 1.3,
          }}
        >
          News · Stats live · Classements · Quiz avec leaderboard
        </div>

        <div
          style={{
            marginTop: "60px",
            display: "flex",
            alignItems: "center",
            gap: "24px",
            fontSize: "26px",
            opacity: 0.7,
          }}
        >
          <span>🇺🇸 USA</span>
          <span>·</span>
          <span>🇨🇦 Canada</span>
          <span>·</span>
          <span>🇲🇽 Mexique</span>
          <span>·</span>
          <span>11 juin → 19 juillet</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
