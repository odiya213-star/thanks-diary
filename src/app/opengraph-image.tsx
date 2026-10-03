import { ImageResponse } from "next/og";

export const alt = "하루감사 - 매일 쓰는 온라인 감사일기";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 82px",
        color: "#f8f4e9",
        background: "#314a3d",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", color: "#edc979", fontSize: 30, fontWeight: 700, letterSpacing: "3px" }}>
        THANKS DIARY
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 72, lineHeight: 1.15, fontWeight: 750, letterSpacing: "-3px" }}>
          <span>Keep today&apos;s gratitude</span>
          <span>in one warm sentence.</span>
        </div>
        <div style={{ color: "#d7dfd8", fontSize: 28 }}>
          A small daily gratitude ritual
        </div>
      </div>
    </div>,
    size,
  );
}
