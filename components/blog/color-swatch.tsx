import { cn } from "@/lib/utils";
import React from "react";

interface ColorSwatchProps {
  colors: {
    color: string;
    label?: string;
    value?: string;
  }[];
  className?: string;
  size?: "small" | "medium" | "large";
}

export function ColorSwatch({
  colors,
  className,
  size = "medium",
}: ColorSwatchProps) {
  const sizeClasses = {
    small: "h-8 w-8",
    medium: "h-12 w-12",
    large: "h-16 w-16",
  };

  return (
    <div className={cn("flex flex-wrap gap-4 my-4", className)}>
      {colors.map((color, index) => (
        <div key={index} className="flex flex-col items-center">
          <div
            className={cn(
              "rounded-md shadow-md border border-neutral-200 dark:border-neutral-800",
              sizeClasses[size],
            )}
            style={{ backgroundColor: color.color }}
            title={color.value || color.color}
          />
          {(color.label || color.value) && (
            <div className="mt-2 text-xs text-center">
              {color.label && <div className="font-medium">{color.label}</div>}
              {color.value && (
                <div className="text-neutral-500 dark:text-neutral-400">
                  {color.value}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
