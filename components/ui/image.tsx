import type { ComponentPropsWithoutRef } from "react";

type ImageProps = Omit<ComponentPropsWithoutRef<"img">, "src"> & {
  src: string;
  /** Renders eagerly and hints high fetch priority. Was `priority` in next/image. */
  priority?: boolean;
  /** Alias kept for call sites that used `preload`. */
  preload?: boolean;
  /** Opt out of any resizing/format transform. Remote images set this. */
  unoptimized?: boolean;
};

/**
 * Replacement for `next/image`. There is no image server on Workers, so the
 * transform strategy is decided in `resolveSrc` below — everything else here
 * is just the loading/priority plumbing next/image used to handle.
 *
 * Vite resolves a static `import avatar from "../public/images/avatar.jpeg"`
 * to a plain URL string, so those call sites need no change.
 */
const resolveSrc = (src: string, width?: number, unoptimized?: boolean) => {
  if (unoptimized || src.startsWith("http") || src.startsWith("data:")) {
    return src;
  }

  // TODO(einar): decide the local-image optimization strategy. See the
  // three options discussed — pass through, Cloudflare /cdn-cgi/image, or
  // build-time variants. `width` is available here for a resize hint.
  return src;
};

export const Image = ({
  src,
  width,
  height,
  priority,
  preload,
  unoptimized,
  ...props
}: ImageProps) => {
  const eager = priority || preload;
  const w = typeof width === "number" ? width : undefined;

  return (
    <img
      src={resolveSrc(src, w, unoptimized)}
      width={width}
      height={height}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      decoding={eager ? "sync" : "async"}
      {...props}
    />
  );
};
