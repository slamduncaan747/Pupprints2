import { ImageResponse } from "next/og";
import sharp from "sharp";
import { getRevealData } from "@/components/reveal/data";
import { BUCKETS, db } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const alt = "A Pup Prints gift";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Fraunces subset from Google Fonts (TTF); falls back to the default font when offline. */
async function loadSerif(text: string): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@72,500&text=${encodeURIComponent(text)}`,
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
  const [font, portrait] = await Promise.all([loadSerif(`${headline}${pet}Pup Prints`), portraitDataUri(data?.imagePath ?? null)]);
  const serif = font ? "Fraunces" : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(180deg, #1d1712 0%, #15110d 100%)",
          color: "#f7efe1",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 1200,
            height: 630,
            backgroundImage: "radial-gradient(circle at 76% 45%, rgba(242,212,146,0.30) 0%, rgba(242,212,146,0.10) 28%, rgba(242,212,146,0) 52%)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 0 0 84px", width: 660 }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 26, color: "#e8cc85", letterSpacing: 1 }}>
            <div style={{ width: 14, height: 14, borderRadius: 9999, background: "#c8553d", marginRight: 12 }} />
            <span style={{ fontFamily: serif }}>Pup Prints</span>
          </div>
          <div style={{ marginTop: 34, fontSize: 70, lineHeight: 1.05, fontFamily: serif, color: "#fbf6ec", display: "flex" }}>
            {headline}
          </div>
          <div style={{ marginTop: 22, fontSize: 32, fontFamily: serif, fontStyle: "italic", color: "rgba(247,239,225,0.8)", display: "flex" }}>
            {pet}
          </div>
          <div style={{ marginTop: 40, display: "flex", alignItems: "center", fontSize: 24, color: "#e8cc85", textTransform: "uppercase", letterSpacing: 4 }}>
            {sub}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, paddingRight: 40 }}>
          {portrait ? (
            <div
              style={{
                display: "flex",
                padding: 18,
                background: "linear-gradient(135deg, #7d5f25 0%, #e8cc85 25%, #a98235 48%, #f3dca0 65%, #8a6a2b 85%, #c9a457 100%)",
                boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
              }}
            >
              <div style={{ display: "flex", padding: 14, background: "#fbf8f1" }}>
                <img src={portrait} width={300} height={375} alt="" style={{ objectFit: "cover" }} />
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 400,
                height: 280,
                borderRadius: 14,
                background: "linear-gradient(160deg, #fbf6ec 0%, #f1e6d2 100%)",
                boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
              }}
            >
              <div
                style={{
                  width: 92,
                  height: 92,
                  borderRadius: 9999,
                  background: "radial-gradient(circle at 35% 30%, #d9705a, #b2432d 55%, #8f3220)",
                }}
              />
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "Fraunces", data: font, style: "normal", weight: 500 }] : undefined,
    },
  );
}
