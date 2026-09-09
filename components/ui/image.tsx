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
 * Assets under public/ are referenced by their served URL rather than
 * imported, so the bundler does not emit a second copy of each one.
 */
const resolveSrc = (src: string, width?: number, unoptimized?: boolean) => {
  if (unoptimized || src.startsWith("http") || src.startsWith("data:")) {
    return src;
  }
  // SVG is already resolution-independent, and there is no /cdn-cgi handler
  // in front of the dev server — both would 404 through the transform.
  if (src.endsWith(".svg") || !import.meta.env.PROD) return src;

  const opts = [`width=${width ?? 1200}`, "format=auto", "quality=85"];
  // Without this the transform returns only the first frame of a GIF.
  if (src.endsWith(".gif")) opts.push("anim=true");

  return `/cdn-cgi/image/${opts.join(",")}${src}`;
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
