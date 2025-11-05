import * as runtime from "react/jsx-runtime";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "./blog/external-link";
import { CodeBlock } from "./blog/code-block";
import { Blockquote } from "./blog/blockquote";
import { Callout } from "./blog/callout";
import { TableOfContents } from "./blog/table-of-contents";
import { CardLink, ReadMoreLink, ResourceLink } from "./blog/link-components";
import { VideoEmbed } from "./blog/video-embed";
import { Accordion, AccordionItem, Tabs } from "./blog/interactive-elements";
import { StylishList, StylishListItem } from "./blog/stylish-list";
import { CaptionedImage } from "./blog/captioned-image";
import { Spacer } from "./blog/spacer";
import { KeyboardShortcut } from "./blog/keyboard-shortcut";
import { ColorSwatch } from "./blog/color-swatch";
import { FileTree } from "./blog/file-tree";
import { Timeline } from "./blog/timeline";
import { Heading, Subheading } from "./blog/heading";
import type { ComponentPropsWithoutRef, ComponentType, ReactNode } from "react";

// A minimal type describing the MDX component we render
type MDXComponent = ComponentType<{ components?: Record<string, unknown> }>;

const sharedComponents: Record<string, ComponentType<any>> = {
  // Basic Next.js components
  Image,
  Link,
  img: ({
    src: rawSrc,
    alt,
    width,
    height,
    className,
  }: ComponentPropsWithoutRef<"img">) => {
    const src = typeof rawSrc === "string" ? rawSrc : undefined;
    if (!src) return null;
    const w =
      typeof width === "number"
        ? width
        : typeof width === "string"
          ? parseInt(width, 10)
          : undefined;
    const h =
      typeof height === "number"
        ? height
        : typeof height === "string"
          ? parseInt(height, 10)
          : undefined;
    return (
      <CaptionedImage
        src={src}
        alt={alt ?? ""}
        width={w}
        height={h}
        className={className}
      />
    );
  },
  a: ({ href, children, ...props }: ComponentPropsWithoutRef<"a">) => {
    if (href && (href.startsWith("http") || href.startsWith("mailto:"))) {
      return <ExternalLink href={href}>{children}</ExternalLink>;
    }
    return href ? (
      <Link href={href} {...props}>
        {children}
      </Link>
    ) : (
      <a {...props}>{children}</a>
    );
  },

  // Code components
  pre: ({ children, className, ...props }: ComponentPropsWithoutRef<"pre">) => {
    // Extract language and code content from code element
    let language = "";
    let codeContent = "";

    // Check if children is a code element with className
    if (React.isValidElement(children)) {
      const codeProps = children.props as {
        className?: string;
        children?: ReactNode;
      };

      // Extract language from code element's className (format: "language-js")
      if (typeof codeProps.className === "string") {
        const match = codeProps.className.match(/language-(\w+)/);
        if (match) {
          language = match[1];
        }
      }

      // Extract code content
      if (typeof codeProps.children === "string") {
        codeContent = codeProps.children;
      }
    } else if (typeof children === "string") {
      // Fallback for direct string children
      codeContent = children;
    }

    return (
      <CodeBlock
        language={language || undefined}
        showLineNumbers={true}
        className={className}
        {...props}
      >
        {codeContent}
      </CodeBlock>
    );
  },

  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code className="bg-muted px-1.5 py-0.5 rounded text-sm" {...props} />
  ),

  // Custom quote components
  blockquote: ({
    children,
    ...props
  }: ComponentPropsWithoutRef<"blockquote">) => (
    <Blockquote {...props}>{children}</Blockquote>
  ),

  // Custom list components
  ul: ({ children, ...props }: ComponentPropsWithoutRef<"ul">) => (
    <StylishList type="disc" {...props}>
      {children}
    </StylishList>
  ),

  li: ({ children, ...props }: ComponentPropsWithoutRef<"li">) => (
    <StylishListItem {...props}>{children}</StylishListItem>
  ),

  ol: (props: ComponentPropsWithoutRef<"ol">) => {
    const { children, ...rest } = props;
    // Remove native <ol> type attribute to avoid conflict with StylishList's type prop
    const { type: _olType, ...clean } = rest as any;
    return (
      <StylishList type="number" {...(clean as any)}>
        {children}
      </StylishList>
    );
  },

  // Custom quote components
  Blockquote,

  // Custom note components
  Callout,

  // Navigation components
  TableOfContents,

  // Link components
  ExternalLink,
  CardLink,
  ResourceLink,
  ReadMoreLink,

  // Media components
  VideoEmbed,
  CaptionedImage,

  // Interactive components
  Tabs,
  Accordion,
  AccordionItem,

  // List components
  StylishList,
  StylishListItem,

  // Layout components
  Spacer,
  KeyboardShortcut,
  ColorSwatch,
  FileTree,
  Timeline,
  Heading,
  Subheading,
};

// Parse the Velite generated MDX code into a React component function
const useMDXComponent = (code: string): MDXComponent => {
  const fn = new Function(code) as (args: any) => {
    default: ComponentType<any>;
  };
  // Provide both jsx runtime and React for components using hooks/state
  const mod = fn({ ...runtime, React });
  return mod.default as MDXComponent;
};

interface MDXProps {
  code: string;
  components?: Record<string, unknown>;
  enableTableOfContents?: boolean;
}

// MDXContent component
export const MDXContent = ({
  code,
  components,
  enableTableOfContents = true,
}: MDXProps) => {
  const Component = useMDXComponent(code);
  return (
    <>
      {enableTableOfContents && <TableOfContents />}
      <article className="mdx-content">
        <Component components={{ ...sharedComponents, ...components }} />
      </article>
    </>
  );
};
