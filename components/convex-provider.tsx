"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";

// Vite exposes PUBLIC_-prefixed vars on import.meta.env; process.env is not
// available in the browser bundle.
const convex = new ConvexReactClient(import.meta.env.PUBLIC_CONVEX_URL);

export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
