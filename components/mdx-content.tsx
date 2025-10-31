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
import type { ReactNode } from "react";

const sharedComponents = {
  // Basic Next.js components
  Image,
  Link,
  img: ({
    src,
    alt,
    ...props
  }: { src?: string; alt?: string } & Record<string, any>) => {
    if (!src) return null;
    return <CaptionedImage src={src} alt={alt || ""} {...props} />;
  },
  a: ({
    href,
    children,
    ...props
  }: { href?: string; children: ReactNode } & Record<string, any>) => {
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
  pre: ({
    children,
    className,
    ...props
  }: { children: ReactNode; className?: string } & Record<string, any>) => {
    // Extract language and code content from code element
    let language = "";
    let codeContent = "";

    // Check if children is a code element with className
    if (children && typeof children === "object" && "props" in children) {
      const codeProps = children.props;

      // Extract language from code element's className (format: "language-js")
      if (codeProps.className) {
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

  code: (props: Record<string, any>) => (
    <code className="bg-muted px-1.5 py-0.5 rounded text-sm" {...props} />
  ),

  // Custom quote components
  blockquote: ({
    children,
    ...props
  }: { children: ReactNode } & Record<string, any>) => (
    <Blockquote {...props}>{children}</Blockquote>
  ),

  // Custom list components
  ul: ({
    children,
    ...props
  }: { children: ReactNode } & Record<string, any>) => (
    <StylishList type="disc" {...props}>
      {children}
    </StylishList>
  ),

  li: ({
    children,
    ...props
  }: { children: ReactNode } & Record<string, any>) => (
    <StylishListItem {...props}>{children}</StylishListItem>
  ),

  ol: ({
    children,
    ...props
  }: { children: ReactNode } & Record<string, any>) => (
    <StylishList type="number" {...props}>
      {children}
    </StylishList>
  ),

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
const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  // Provide both jsx runtime and React for components using hooks/state
  return fn({ ...runtime, React }).default;
};

interface MDXProps {
  code: string;
  components?: Record<string, any>;
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
