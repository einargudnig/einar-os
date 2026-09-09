import { ConvexProvider, ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";

let client: ConvexReactClient | undefined;

const getConvexClient = () => {
  const url = import.meta.env.VITE_CONVEX_URL as string | undefined;
  if (!url) return undefined;
  client ??= new ConvexReactClient(url);
  return client;
};

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const convex = getConvexClient();
  if (!convex) return <>{children}</>;
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
