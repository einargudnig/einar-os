import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date into a reader-friendly format
 * @param dateString - ISO format date string (YYYY-MM-DD), or a Date
 *   (content collections parse frontmatter dates into Date objects)
 * @returns Formatted date string (e.g., "October 11, 2024")
 */
export function formatBlogDate(dateString: string | Date): string {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
