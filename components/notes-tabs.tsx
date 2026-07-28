"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Tab = "notes" | "links";

export function NotesTabs({
  notes,
  links,
}: {
  notes: React.ReactNode;
  links: React.ReactNode;
}) {
  const [active, setActive] = useState<Tab>("notes");

  return (
    <div>
      <div className="flex gap-1 border-b border-border/50 mb-8">
        <TabButton active={active === "notes"} onClick={() => setActive("notes")}>
          Notes
        </TabButton>
        <TabButton active={active === "links"} onClick={() => setActive("links")}>
          Links
        </TabButton>
      </div>
      {active === "notes" ? notes : links}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-2 text-sm font-medium transition-colors relative",
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground/80",
      )}
    >
      {children}
      {active && (
        <span className="absolute bottom-0 left-3 right-3 h-px bg-foreground" />
      )}
    </button>
  );
}
