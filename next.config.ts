import type { NextConfig } from "next";

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
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN,
  },
};

export default nextConfig;
