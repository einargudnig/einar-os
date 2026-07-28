"use client";

// The Convex provider used to wrap the whole app in app/layout.tsx. Only this
// page needs it, so it lives here — every other page now loads no Convex
// client at all.
import { ConvexClientProvider } from "./convex-provider";
import { BabyPage } from "./baby-page";

export function BabyIsland() {
  return (
    <ConvexClientProvider>
      <BabyPage />
    </ConvexClientProvider>
  );
}
