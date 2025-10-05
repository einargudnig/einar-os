import type { NextConfig } from "next";

// Log environment variable presence
console.log("========================================");
console.log("Next.js Environment Variable Check:");
console.log(
  "SPOTIFY_CLIENT_ID:",
  process.env.SPOTIFY_CLIENT_ID ? "✓ Available" : "✗ Missing",
);
console.log(
  "SPOTIFY_CLIENT_SECRET:",
  process.env.SPOTIFY_CLIENT_SECRET ? "✓ Available" : "✗ Missing",
);
console.log(
  "SPOTIFY_REFRESH_TOKEN:",
  process.env.SPOTIFY_REFRESH_TOKEN ? "✓ Available" : "✗ Missing",
);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("========================================");

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    viewTransition: true,
  },
  // Enable image domain for Spotify album artwork
  images: {
    domains: ["i.scdn.co"],
  },
  // Make sure environment variables are loaded correctly in server components
  env: {
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID || "",
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET || "",
    SPOTIFY_REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN || "",
  },
  // Custom webpack config to inject dotenv
  webpack: (config, { isServer }) => {
    // Additional webpack config if needed
    return config;
  },
};

export default nextConfig;
