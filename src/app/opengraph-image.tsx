import { ImageResponse } from "next/og";

// Branded social-share preview (LinkedIn, X, etc.). 1200x630.
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Nico — Desarrollo web profesional";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "78px 84px",
          background: "linear-gradient(135deg, #0a090e 0%, #14100a 58%, #1d1206 100%)",
          color: "#F2F0EB",
          fontFamily: "sans-serif",
        }}
      >
        {/* sun glow */}
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -140,
            width: 560,
            height: 560,
            borderRadius: "50%",
            display: "flex",
            background:
              "radial-gradient(circle, rgba(255,170,55,0.6) 0%, rgba(255,138,30,0.12) 55%, rgba(255,138,30,0) 72%)",
          }}
        />

        {/* eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 26, color: "#FFB020", letterSpacing: 3 }}>
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#FFB020", display: "flex" }} />
          PORTFOLIO
        </div>

        {/* title */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 90, fontWeight: 700, lineHeight: 1.04 }}>Nicolás Agostini</div>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 600, lineHeight: 1.1, color: "#FF9E2C", marginTop: 6 }}>
            Desarrollador de software
          </div>
          <div style={{ display: "flex", fontSize: 31, color: "#BAB5AD", marginTop: 26, maxWidth: 920 }}>
            Los proyectos que construí — y desde donde creamos tu próxima web.
          </div>
        </div>

        {/* footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 25 }}>
          <span style={{ color: "#8C877F" }}>naggost-portfolio.vercel.app</span>
          <span style={{ color: "#FFB020" }}>Next.js · React · TypeScript · Three.js</span>
        </div>
      </div>
    ),
    size,
  );
}
