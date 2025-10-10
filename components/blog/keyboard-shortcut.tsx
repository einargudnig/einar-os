import { cn } from "@/lib/utils";
import React from "react";

interface KeyboardShortcutProps {
  keys: string[];
  description?: string;
  className?: string;
}

export function KeyboardShortcut({
  keys,
  description,
  className,
}: KeyboardShortcutProps) {
  return (
    <div className={cn("flex items-center text-sm my-2", className)}>
      <div className="flex items-center gap-1">
        {keys.map((key, index) => (
          <React.Fragment key={index}>
            <kbd className="px-2 py-1 font-mono text-xs font-semibold text-neutral-900 bg-neutral-100 border border-neutral-200 rounded shadow-sm dark:bg-neutral-800 dark:text-neutral-100 dark:border-neutral-700">
              {key}
            </kbd>
            {index < keys.length - 1 && <span className="mx-1">+</span>}
          </React.Fragment>
        ))}
      </div>
      {description && (
        <span className="ml-3 text-neutral-400">{description}</span>
      )}
    </div>
  );
}
