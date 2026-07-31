import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-border/50 bg-transparent px-3 py-1 text-sm transition-[color,border-color,box-shadow] duration-150 ease-[var(--ease-out)] outline-none",
        "placeholder:text-muted-foreground/60 selection:bg-brand/20",
        "focus-visible:border-brand/40 focus-visible:ring-brand/20 focus-visible:ring-[3px]",
        "disabled:pointer-events-none disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
