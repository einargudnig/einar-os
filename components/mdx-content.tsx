import * as runtime from "react/jsx-runtime";
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
    // Extract language from className (usually in format "language-js")
    const languageClass = className || "";
    const language = languageClass.replace(/language-/, "");

    // Extract code content safely
    let codeContent = "";

    // Handle string children directly
    if (typeof children === "string") {
      codeContent = children;
    }
    // Otherwise, try to extract from code element child
    else if (children) {
      // Get string content from child elements if possible
      const getStringContent = (child: any): string => {
        if (typeof child === "string") return child;
        if (!child || typeof child !== "object") return "";

        // If it has props.children, try to get content from there
        if ("props" in child && child.props && child.props.children) {
          if (typeof child.props.children === "string") {
            return child.props.children;
          }
        }
        return "";
      };

      codeContent = getStringContent(children);
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
  return fn({ ...runtime }).default;
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
