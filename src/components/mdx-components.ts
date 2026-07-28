// Replaces the `sharedComponents` map in components/mdx-content.tsx.
// Astro renders MDX directly, so the `new Function()` eval of Velite-compiled
// code is gone — these are just the tag/component overrides.
//
// Anything interactive needs a client directive, which the `components` prop
// can't express. Those get a thin .astro wrapper in src/components/mdx/.
import type { ComponentProps } from "react";
import { Blockquote } from "@/components/blog/blockquote";
import { Callout } from "@/components/blog/callout";
import { CaptionedImage } from "@/components/blog/captioned-image";
import { ColorSwatch } from "@/components/blog/color-swatch";
import { ExternalLink } from "@/components/blog/external-link";
import { Heading, Subheading } from "@/components/blog/heading";
import { KeyboardShortcut } from "@/components/blog/keyboard-shortcut";
import { CardLink, ReadMoreLink, ResourceLink } from "@/components/blog/link-components";
import { Spacer } from "@/components/blog/spacer";
import { StylishList, StylishListItem } from "@/components/blog/stylish-list";
import { Timeline } from "@/components/blog/timeline";
import { VideoEmbed } from "@/components/blog/video-embed";
import { YouTubeEmbed } from "@/components/blog/youtube-embed";

import Accordion from "./mdx/Accordion.astro";
import AccordionItem from "./mdx/AccordionItem.astro";
import Anchor from "./mdx/Anchor.astro";
import FileTree from "./mdx/FileTree.astro";
import Pre from "./mdx/Pre.astro";
import Tabs from "./mdx/Tabs.astro";
import TableOfContents from "./mdx/TableOfContents.astro";

export const mdxComponents = {
  // Element overrides
  a: Anchor,
  pre: Pre,
  blockquote: Blockquote,
  ul: (props: ComponentProps<typeof StylishList>) => StylishList({ ...props, type: "disc" }),
  ol: (props: ComponentProps<typeof StylishList>) => StylishList({ ...props, type: "number" }),
  li: StylishListItem,
  img: CaptionedImage,

  // Static components
  Blockquote,
  Callout,
  CaptionedImage,
  CardLink,
  ColorSwatch,
  ExternalLink,
  Heading,
  KeyboardShortcut,
  ReadMoreLink,
  ResourceLink,
  Spacer,
  StylishList,
  StylishListItem,
  Subheading,
  Timeline,
  VideoEmbed,
  YouTubeEmbed,

  // Interactive — hydrated via .astro wrappers
  Accordion,
  AccordionItem,
  FileTree,
  Tabs,
  TableOfContents,
};
