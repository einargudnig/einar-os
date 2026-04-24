import { describe, it, expect } from "vitest";
import { cn, formatBlogDate } from "./utils";

describe("cn", () => {
  it("joins multiple class strings", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("filters out falsy values", () => {
    expect(cn("foo", false, null, undefined, "", "bar")).toBe("foo bar");
  });

  it("supports conditional object syntax", () => {
    expect(cn("foo", { bar: true, baz: false })).toBe("foo bar");
  });

  it("flattens nested arrays", () => {
    expect(cn(["foo", ["bar", "baz"]])).toBe("foo bar baz");
  });

  it("merges conflicting Tailwind classes, last one wins", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("preserves non-conflicting Tailwind classes", () => {
    expect(cn("px-2 py-1", "bg-red-500")).toBe("px-2 py-1 bg-red-500");
  });

  it("returns an empty string when called with no args", () => {
    expect(cn()).toBe("");
  });
});

describe("formatBlogDate", () => {
  it("formats an ISO date string as 'Month Day, Year'", () => {
    expect(formatBlogDate("2024-10-11")).toBe("October 11, 2024");
  });

  it("handles single-digit days without zero-padding", () => {
    expect(formatBlogDate("2024-01-05")).toBe("January 5, 2024");
  });

  it("formats every month name in full", () => {
    expect(formatBlogDate("2024-02-15")).toBe("February 15, 2024");
    expect(formatBlogDate("2024-12-31")).toBe("December 31, 2024");
  });

  it("returns 'Invalid Date' for unparseable input", () => {
    expect(formatBlogDate("not-a-date")).toBe("Invalid Date");
  });
});
