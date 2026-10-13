import { ImageResponse } from "next/og";
import sharp from "sharp";
import { getRevealData } from "@/components/reveal/data";
import { BUCKETS, db } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const alt = "A Pup Prints gift";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Bodoni Moda subset from Google Fonts (TTF); falls back to the default font when offline. */
async function loadSerif(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Bodoni+Moda&text=${encodeURIComponent(text)}`,
      {
        headers: {
          // An old Safari UA makes Google Fonts return a TTF (Satori can't read WOFF2).
          "User-Agent":
            "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1",
        },
        signal: AbortSignal.timeout(3000),
      },
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url, { signal: AbortSignal.timeout(3000) }).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

async function portraitDataUri(path: string | null): Promise<string | null> {
  const c = db();
  if (!c || !path) return null;
  try {
    const { data } = await c.storage.from(BUCKETS.portraits).download(path);
    if (!data) return null;
    const jpg = await sharp(Buffer.from(await data.arrayBuffer()))
      .resize(392, 490, { fit: "cover", position: "north" })
      .jpeg({ quality: 82 })
      .toBuffer();
    return `data:image/jpeg;base64,${jpg.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const data = await getRevealData(token);
  const headline = data
    ? data.kind === "gift"
      ? data.recipientName
        ? `A gift for ${data.recipientName}`
        : "A gift for you"
      : data.recipientName
        ? `For ${data.recipientName}, with love`
        : "Someone made you something"
    : "A gift for you";
  const sub = data?.senderName ? `From ${data.senderName}` : "Made with Pup Prints";
  const pet = data?.petName
    ? data.kind === "gift"
      ? `${data.petName}, as a work of art`
      : `A portrait of ${data.petName}`
    : "A one-of-a-kind portrait";
  const [font, portrait] = await Promise.all([loadSerif(`${headline}${pet}PUP PRINTS${sub.toUpperCase()}TAP TO REVEAL`), portraitDataUri(data?.imagePath ?? null)]);
  const serif = font ? "Bodoni Moda" : undefined;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#ffffff", color: "#0a0a0a" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 0 0 88px", width: 680 }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, fontFamily: serif }}>PUP PRINTS</div>
          <div style={{ marginTop: 52, fontSize: 74, lineHeight: 1.04, fontFamily: serif, display: "flex" }}>{headline}</div>
          <div style={{ marginTop: 22, fontSize: 32, lineHeight: 1.2, fontFamily: serif, color: "#3d3d3d", display: "flex" }}>{pet}</div>
          <div style={{ marginTop: 52, display: "flex", fontSize: 17, color: "#6a6a6a", textTransform: "uppercase", letterSpacing: 4 }}>
            {sub}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, paddingRight: 48 }}>
          {portrait ? (
            <div style={{ display: "flex", padding: 7, background: "#121212", boxShadow: "0 28px 48px -28px rgba(0,0,0,0.4)" }}>
              <img src={portrait} width={336} height={420} alt="" style={{ objectFit: "cover" }} />
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 356,
                height: 440,
                padding: 7,
                background: "#121212",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                  height: "100%",
                  background: "#f6f4ef",
                  fontSize: 17,
                  color: "#6a6a6a",
                  textTransform: "uppercase",
                  letterSpacing: 4,
                }}
              >
                Tap to reveal
              </div>
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "Bodoni Moda", data: font, style: "normal", weight: 400 }] : undefined,
    },
  );
}
