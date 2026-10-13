/**
 * A tiny hand-drawn stroke "font" for the preview watermark.
 *
 * Sharp renders SVG with librsvg, and text needs system fonts that serverless hosts
 * (Vercel) often lack — text would silently render as nothing or tofu boxes. Drawing
 * the letters as stroked paths makes the watermark render identically everywhere.
 *
 * Glyphs live on a grid with cap height 10 (y grows downward). `w` is the advance width.
 */
type Glyph = { d: string; w: number; dot?: boolean };

const GLYPHS: Record<string, Glyph> = {
  P: { d: "M0 10V0H3.6C6.6 0 6.6 5.4 3.6 5.4H0", w: 5.6 },
  U: { d: "M0 0V6.3C0 11.2 6 11.2 6 6.3V0", w: 6 },
  R: { d: "M0 10V0H3.6C6.6 0 6.6 5.4 3.6 5.4H0M3.4 5.4L6 10", w: 6 },
  I: { d: "M0 0V10", w: 0 },
  N: { d: "M0 10V0L6.2 10V0", w: 6.2 },
  T: { d: "M0 0H6M3 0V10", w: 6 },
  S: {
    d: "M5.5 1.5C4.8 0.5 3.9 0 2.9 0C1.3 0 0.3 1 0.3 2.5C0.3 6 5.9 4.3 5.9 7.4C5.9 9 4.7 10 3 10C1.8 10 0.7 9.4 0 8.4",
    w: 5.9,
  },
  E: { d: "M5.2 0H0V10H5.2M0 5H4.6", w: 5.2 },
  V: { d: "M0 0L3.1 10L6.2 0", w: 6.2 },
  W: { d: "M0 0L2 10L4.2 2.6L6.4 10L8.4 0", w: 8.4 },
  F: { d: "M5 0H0V10M0 5H4.4", w: 5 },
  "·": { d: "", w: 1.4, dot: true },
  " ": { d: "", w: 2.6 },
};

const TRACKING = 3.2; // generous letter-spacing reads as "premium"

/** Width of a string in glyph units (cap height = 10). */
export function measureGlyphs(text: string): number {
  let x = 0;
  for (const ch of text.toUpperCase()) {
    const g = GLYPHS[ch] ?? GLYPHS[" "];
    x += g.w + TRACKING;
  }
  return Math.max(0, x - TRACKING);
}

/**
 * SVG markup for `text` drawn at the origin (cap height 10 units).
 * `strokes` are open paths (style them with stroke attributes on a parent <g>);
 * `dots` are filled circles for "·" (style them with fill on a parent <g>).
 */
export function glyphMarkup(text: string): { strokes: string; dots: string } {
  let x = 0;
  const strokes: string[] = [];
  const dots: string[] = [];
  for (const ch of text.toUpperCase()) {
    const g = GLYPHS[ch] ?? GLYPHS[" "];
    if (g.dot) {
      dots.push(`<circle cx="${(x + g.w / 2).toFixed(2)}" cy="5" r="0.95"/>`);
    } else if (g.d) {
      strokes.push(`<path transform="translate(${x.toFixed(2)} 0)" d="${g.d}"/>`);
    }
    x += g.w + TRACKING;
  }
  return { strokes: strokes.join(""), dots: dots.join("") };
}
