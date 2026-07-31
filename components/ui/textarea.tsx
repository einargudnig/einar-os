import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-20 w-full resize-none rounded-md border border-border/50 bg-transparent px-3 py-2 text-sm transition-[color,border-color,box-shadow] duration-150 ease-[var(--ease-out)] outline-none",
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

export { Textarea };
