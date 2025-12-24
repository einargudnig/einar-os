import { ImageResponse } from "next/og";

export const ogImageSize = {
  width: 1200,
  height: 630,
};

export const ogImageContentType = "image/png";

interface OGImageOptions {
  title: string;
  description?: string;
  date?: string;
  type?: "blog" | "deep-dive" | "page";
}

export function generateOGImage({ title, description, date, type }: OGImageOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          padding: "80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Type badge */}
        {type && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#262626",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "24px",
              color: "#a3a3a3",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontWeight: 600,
            }}
          >
            {type === "blog" ? "Blog Post" : type === "deep-dive" ? "Deep Dive" : ""}
          </div>
        )}

        {/* Main content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            flex: 1,
            justifyContent: "center",
            width: "100%",
          }}
        >
          {/* Title */}
          <h1
            style={{
              fontSize: "72px",
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.1,
              margin: 0,
              maxWidth: "90%",
            }}
          >
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p
              style={{
                fontSize: "32px",
                color: "#a3a3a3",
                lineHeight: 1.4,
                margin: 0,
                maxWidth: "85%",
              }}
            >
              {description}
            </p>
          )}

          {/* Date */}
          {date && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#262626",
                padding: "8px 20px",
                borderRadius: "6px",
                fontSize: "24px",
                color: "#a3a3a3",
                fontFamily: "monospace",
                width: "fit-content",
              }}
            >
              {date}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: "32px",
              fontWeight: 600,
              color: "#ffffff",
            }}
          >
            Einar Gudni
          </div>
          <div
            style={{
              fontSize: "24px",
              color: "#737373",
            }}
          >
            einargudni.com
          </div>
        </div>
      </div>
    ),
    {
      ...ogImageSize,
    }
  );
}
