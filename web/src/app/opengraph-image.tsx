import { ImageResponse } from "next/og";
import { site } from "@/lib/config";

/**
 * Site-wide default Open Graph image (1200×630), used by every page that doesn't set its own.
 * Drawn in code so it always exists, even before sample portraits are generated.
 */
export const alt = `${site.name}: custom fine-art portraits of your dog`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#faf6ef";
const INK = "#1b1814";
const INK_2 = "#4a443c";
const CLAY = "#c8553d";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: PAPER,
          padding: "64px 72px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 640 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="52" height="52" viewBox="0 0 32 32" fill="none">
              <rect x="1.5" y="1.5" width="29" height="29" rx="7" stroke={CLAY} strokeWidth="2.2" />
              <ellipse cx="16" cy="20.2" rx="5.4" ry="4.4" fill={CLAY} />
              <ellipse cx="9.6" cy="14.2" rx="2.1" ry="2.7" fill={CLAY} />
              <ellipse cx="13.6" cy="10.4" rx="2.1" ry="2.8" fill={CLAY} />
              <ellipse cx="18.4" cy="10.4" rx="2.1" ry="2.8" fill={CLAY} />
              <ellipse cx="22.4" cy="14.2" rx="2.1" ry="2.7" fill={CLAY} />
            </svg>
            <div style={{ fontSize: 40, fontWeight: 700, color: INK, letterSpacing: -1 }}>{site.name}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 76, lineHeight: 1.02, color: INK, letterSpacing: -2 }}>Your dog,</div>
            <div style={{ fontSize: 76, lineHeight: 1.02, color: INK, letterSpacing: -2 }}>as a work of art.</div>
            <div style={{ marginTop: 28, fontSize: 30, lineHeight: 1.35, color: INK_2 }}>
              Custom portraits from your photo. See yours free in about a minute.
            </div>
          </div>
          <div style={{ display: "flex", gap: 28, fontSize: 24, color: INK_2 }}>
            <span>Free preview</span>
            <span style={{ color: CLAY }}>·</span>
            <span>Free US shipping</span>
            <span style={{ color: CLAY }}>·</span>
            <span>Love-it guarantee</span>
          </div>
        </div>
        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              padding: 18,
              background: "linear-gradient(135deg, #8a6a2b, #e2c27a 40%, #a07c34 70%, #6e521f)",
              boxShadow: "0 24px 48px -12px rgba(27,24,20,0.35)",
              transform: "rotate(2deg)",
            }}
          >
            <div
              style={{
                width: 300,
                height: 375,
                display: "flex",
                alignItems: "flex-end",
                padding: 24,
                background: "radial-gradient(circle at 50% 35%, #e9b8a6 0%, #c8553d 55%, #7a2e2a 100%)",
                color: "rgba(255,255,255,0.9)",
                fontSize: 26,
              }}
            >
              Fine-art dog portraits
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
