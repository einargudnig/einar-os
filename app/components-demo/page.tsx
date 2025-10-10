import { Blockquote } from "@/components/blog/blockquote";
import { Callout } from "@/components/blog/callout";
import { CodeBlock } from "@/components/blog/code-block";
import { TableOfContents } from "@/components/blog/table-of-contents";
import {
  CardLink,
  ReadMoreLink,
  ResourceLink,
} from "@/components/blog/link-components";
import { VideoEmbed } from "@/components/blog/video-embed";
import {
  Accordion,
  AccordionItem,
  Tabs,
} from "@/components/blog/interactive-elements";
import { StylishList, StylishListItem } from "@/components/blog/stylish-list";
import { CaptionedImage } from "@/components/blog/captioned-image";
import { Spacer } from "@/components/blog/spacer";
import { KeyboardShortcut } from "@/components/blog/keyboard-shortcut";
import { ColorSwatch } from "@/components/blog/color-swatch";
import { FileTree } from "@/components/blog/file-tree";
import { Timeline } from "@/components/blog/timeline";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <section className="mx-auto w-full max-w-2xl space-y-8 print:space-y-6">
      <Link
        href="/"
        className="inline-flex items-center mb-8 hover:text-neutral-300 text-neutral-400"
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to Home
      </Link>

      <h1 className="font-bold text-3xl font-serif max-w-[650px]">
        Blog Components Demo
      </h1>

      <article className="prose prose-invert">
        <h2>Table of Contents</h2>
        <TableOfContents />

        <p className="my-4">
          <ReadMoreLink href="/component-docs">
            View full component documentation
          </ReadMoreLink>
        </p>

        <h2 id="blockquotes">Blockquotes</h2>
        <Blockquote
          author="Albert Einstein"
          citation="Address to the Physical Society, Berlin, 1918"
        >
          The most beautiful thing we can experience is the mysterious. It is
          the source of all true art and science.
        </Blockquote>

        <h2 id="callouts">Callouts</h2>
        <Callout type="info" title="Information">
          This is an informational callout. Use it for providing additional
          context or details.
        </Callout>

        <Callout type="warning" title="Warning">
          This is a warning callout. Use it to alert readers about potential
          issues or things to consider.
        </Callout>

        <Callout type="error" title="Error">
          This is an error callout. Use it to highlight critical issues or
          problems.
        </Callout>

        <Callout type="tip" title="Tip">
          This is a tip callout. Use it to provide helpful suggestions or best
          practices.
        </Callout>

        <h2 id="code-blocks">Code Blocks</h2>
        <CodeBlock
          language="typescript"
          showLineNumbers={true}
          filename="example.ts"
        >
          {`// A simple function in TypeScript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

const user = "Reader";
console.log(greet(user));`}
        </CodeBlock>

        <h2 id="link-components">Link Components</h2>
        <h3>Card Link</h3>
        <CardLink
          href="https://nextjs.org"
          title="Next.js"
          description="The React framework for production"
          external={true}
        />

        <h3>Resource Link</h3>
        <p>
          Check out <ResourceLink href="/about">my About page</ResourceLink> for
          more information.
        </p>

        <h3>Read More Link</h3>
        <ReadMoreLink href="/blog">See all blog posts</ReadMoreLink>

        <h2 id="video-embed">Video Embed</h2>
        <VideoEmbed
          src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
          caption="A very interesting video"
        />

        <h2 id="interactive-elements">Interactive Elements</h2>
        <h3>Tabs</h3>
        <Tabs
          items={[
            {
              label: "First Tab",
              content: "This is the content of the first tab.",
            },
            {
              label: "Second Tab",
              content: "This is the content of the second tab.",
            },
            {
              label: "Third Tab",
              content: "This is the content of the third tab.",
            },
          ]}
        />

        <h3>Accordion</h3>
        <Accordion>
          <AccordionItem title="How do I use these components?">
            Simply import them in your MDX file and use them as JSX components.
          </AccordionItem>
          <AccordionItem title="Can I customize these components?">
            Yes! You can modify the component source code to change styling.
          </AccordionItem>
          <AccordionItem title="Are these components accessible?">
            The components are built with basic accessibility features.
          </AccordionItem>
        </Accordion>

        <h2 id="captioned-images">Captioned Images</h2>
        <h3>Image with Caption</h3>
        <CaptionedImage
          src="/vercel.svg"
          alt="Vercel Logo"
          width={400}
          height={100}
          caption="This is the Vercel logo with a caption"
        />

        <h3>Image without Caption</h3>
        <CaptionedImage
          src="/next.svg"
          alt="Next.js Logo"
          width={400}
          height={100}
        />

        <h2 id="stylish-lists">Stylish Lists</h2>

        <h3>Default (Disc) List</h3>
        <StylishList>
          <StylishListItem>First item in an unordered list</StylishListItem>
          <StylishListItem>
            Second item with some longer text that might wrap to the next line
            to see how the alignment works
          </StylishListItem>
          <StylishListItem>Third item in the list</StylishListItem>
        </StylishList>

        <h3>Numbered List</h3>
        <StylishList type="number">
          <StylishListItem>First step to follow</StylishListItem>
          <StylishListItem>
            Second step with detailed instructions that might wrap to multiple
            lines to test the alignment of numbers
          </StylishListItem>
          <StylishListItem>Final step in the process</StylishListItem>
        </StylishList>

        <h3>Checkmark List</h3>
        <StylishList type="check" gap="loose">
          <StylishListItem>Completed task one</StylishListItem>
          <StylishListItem>Completed task two</StylishListItem>
          <StylishListItem>Completed task three</StylishListItem>
        </StylishList>

        <h3>Circle List</h3>
        <StylishList type="circle" gap="tight">
          <StylishListItem>Compact list item one</StylishListItem>
          <StylishListItem>Compact list item two</StylishListItem>
          <StylishListItem>Compact list item three</StylishListItem>
        </StylishList>

        <h3>Plain Markdown Lists</h3>
        <p>Regular markdown unordered list:</p>
        <ul>
          <li>This is a standard markdown list item</li>
          <li>That will be styled by our custom component</li>
          <li>Without needing explicit JSX tags</li>
        </ul>

        <p>Regular markdown ordered list:</p>
        <ol>
          <li>This is a standard markdown ordered list</li>
          <li>That will display proper numbering</li>
          <li>Without needing explicit JSX tags</li>
        </ol>

        <h2 id="spacer">Spacer Component</h2>
        <p>Text before a small spacer:</p>
        <Spacer size="small" />
        <p>Text after small spacer, before medium spacer:</p>
        <Spacer size="medium" />
        <p>Text after medium spacer, before large spacer:</p>
        <Spacer size="large" />
        <p>Text after large spacer, before xl spacer:</p>
        <Spacer size="xl" />
        <p>Text after xl spacer.</p>

        <h2 id="keyboard-shortcuts">Keyboard Shortcuts</h2>
        <p>Examples of keyboard shortcut components:</p>

        <KeyboardShortcut
          keys={["Ctrl", "C"]}
          description="Copy to clipboard"
        />
        <KeyboardShortcut
          keys={["Ctrl", "Shift", "P"]}
          description="Open command palette"
        />
        <KeyboardShortcut keys={["⌘", "S"]} description="Save file (macOS)" />
        <KeyboardShortcut
          keys={["Alt", "Tab"]}
          description="Switch between windows"
        />

        <h2 id="color-swatches">Color Swatches</h2>
        <p>Examples of color swatch components:</p>

        <h3>Primary Colors</h3>
        <ColorSwatch
          colors={[
            { color: "#ef4444", label: "Red", value: "#ef4444" },
            { color: "#f97316", label: "Orange", value: "#f97316" },
            { color: "#eab308", label: "Yellow", value: "#eab308" },
            { color: "#22c55e", label: "Green", value: "#22c55e" },
            { color: "#3b82f6", label: "Blue", value: "#3b82f6" },
            { color: "#8b5cf6", label: "Purple", value: "#8b5cf6" },
          ]}
        />

        <h3>Neutral Colors (Small)</h3>
        <ColorSwatch
          size="small"
          colors={[
            { color: "#0a0a0a", label: "Black", value: "#0a0a0a" },
            { color: "#3f3f3f", label: "Gray 900", value: "#3f3f3f" },
            { color: "#737373", label: "Gray 700", value: "#737373" },
            { color: "#a3a3a3", label: "Gray 500", value: "#a3a3a3" },
            { color: "#d4d4d4", label: "Gray 300", value: "#d4d4d4" },
            { color: "#f5f5f5", label: "Gray 100", value: "#f5f5f5" },
            { color: "#ffffff", label: "White", value: "#ffffff" },
          ]}
        />

        <h3>Brand Colors (Large)</h3>
        <ColorSwatch
          size="large"
          colors={[
            { color: "#000000", label: "Primary" },
            { color: "#6b7280", label: "Secondary" },
            { color: "#f97316", label: "Accent" },
          ]}
        />

        <h2 id="file-tree">File Tree</h2>
        <p>Example of file tree component:</p>

        <FileTree
          data={[
            {
              name: "project-root",
              children: [
                {
                  name: "src",
                  isOpen: true,
                  children: [
                    {
                      name: "components",
                      children: [
                        { name: "Button.tsx" },
                        { name: "Card.tsx" },
                        { name: "Input.tsx" },
                      ],
                    },
                    {
                      name: "pages",
                      children: [
                        { name: "index.tsx" },
                        { name: "about.tsx" },
                        { name: "blog.tsx" },
                      ],
                    },
                    { name: "styles.css" },
                    { name: "utils.ts" },
                  ],
                },
                {
                  name: "public",
                  children: [{ name: "favicon.ico" }, { name: "logo.svg" }],
                },
                { name: "README.md" },
                { name: "package.json" },
              ],
            },
          ]}
        />

        <h2 id="timeline">Timeline</h2>
        <p>Example of timeline component:</p>

        <Timeline
          items={[
            {
              date: "June 2023",
              title: "Initial Project Launch",
              description:
                "Created the first version of the blog platform with basic functionality.",
            },
            {
              date: "August 2023",
              title: "Added Custom Components",
              description:
                "Developed core UI components for improved content display and readability.",
            },
            {
              date: "October 2023",
              title: "Performance Optimizations",
              description:
                "Implemented lazy loading and image optimizations for better page speed.",
            },
            {
              date: "January 2024",
              title: "Major Design Overhaul",
              description:
                "Completely redesigned the user interface for better aesthetics and usability.",
            },
            {
              date: "Present",
              title: "Continuous Improvements",
              description:
                "Adding new features and refining existing components based on feedback.",
            },
          ]}
        />
      </article>
    </section>
  );
}
