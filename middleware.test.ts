import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

function makeRequest(pathname: string, accept?: string): NextRequest {
  const headers = new Headers();
  if (accept !== undefined) headers.set("accept", accept);
  return new NextRequest(new URL(`https://einargudni.com${pathname}`), {
    headers,
  });
}

describe("middleware", () => {
  describe("when the client does not request markdown", () => {
    it("passes through with no Accept header", () => {
      const res = middleware(makeRequest("/blog/hello"));
      expect(res.headers.get("x-middleware-next")).toBe("1");
      expect(res.headers.get("x-middleware-rewrite")).toBeNull();
    });

    it("passes through when Accept is text/html", () => {
      const res = middleware(makeRequest("/blog/hello", "text/html"));
      expect(res.headers.get("x-middleware-next")).toBe("1");
      expect(res.headers.get("x-middleware-rewrite")).toBeNull();
    });
  });

  describe("when the client requests markdown", () => {
    it("rewrites '/' to /api/md-root", () => {
      const res = middleware(makeRequest("/", "text/markdown"));
      const rewrite = res.headers.get("x-middleware-rewrite");
      expect(rewrite).not.toBeNull();
      expect(new URL(rewrite!).pathname).toBe("/api/md-root");
    });

    it("rewrites a blog post path to /api/md/blog/<slug>", () => {
      const res = middleware(makeRequest("/blog/my-post", "text/markdown"));
      const rewrite = res.headers.get("x-middleware-rewrite");
      expect(rewrite).not.toBeNull();
      expect(new URL(rewrite!).pathname).toBe("/api/md/blog/my-post");
    });

    it("rewrites a deep-dive path to /api/md/deep-dive/<slug>", () => {
      const res = middleware(
        makeRequest("/deep-dive/some-topic", "text/markdown"),
      );
      const rewrite = res.headers.get("x-middleware-rewrite");
      expect(rewrite).not.toBeNull();
      expect(new URL(rewrite!).pathname).toBe("/api/md/deep-dive/some-topic");
    });

    it("matches when text/markdown is one of several Accept values", () => {
      const res = middleware(
        makeRequest("/blog/foo", "text/html, text/markdown;q=0.9"),
      );
      expect(new URL(res.headers.get("x-middleware-rewrite")!).pathname).toBe(
        "/api/md/blog/foo",
      );
    });

    it("does NOT rewrite a nested blog path (only a single segment under /blog)", () => {
      const res = middleware(
        makeRequest("/blog/category/sub", "text/markdown"),
      );
      expect(res.headers.get("x-middleware-next")).toBe("1");
      expect(res.headers.get("x-middleware-rewrite")).toBeNull();
    });

    it("does NOT rewrite a top-level page that lacks an MDX source", () => {
      const res = middleware(makeRequest("/about", "text/markdown"));
      expect(res.headers.get("x-middleware-next")).toBe("1");
      expect(res.headers.get("x-middleware-rewrite")).toBeNull();
    });
  });
});
