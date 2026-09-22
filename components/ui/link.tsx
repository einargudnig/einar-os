import { Link as RouterLink } from "@tanstack/react-router";
import type { ComponentPropsWithoutRef } from "react";

type LinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href: string;
  prefetch?: boolean;
};

const isExternal = (href: string) =>
  href.startsWith("http") ||
  href.startsWith("mailto:") ||
  href.startsWith("tel:") ||
  href.startsWith("#");

/**
 * Drop-in replacement for `next/link`, taking `href` rather than the router's
 * `to` + `params`. External, mail and in-page hash targets fall through to a
 * plain anchor; everything else routes client-side.
 */
export const Link = ({ href, prefetch: _prefetch, ...props }: LinkProps) => {
  if (isExternal(href)) return <a href={href} {...props} />;
  return <RouterLink to={href} {...props} />;
};
