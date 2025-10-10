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
        Blog Component Usage Guide
      </h1>

      <article className="prose prose-invert">
        <p>
          This guide shows how to use the custom components in your MDX files to
          create rich, interactive blog posts.
        </p>

        <h2>Basic Markdown Elements</h2>
        <p>
          Standard Markdown elements like headings, paragraphs, bold, italic,
          and links work as expected in MDX. For example:
        </p>

        <pre>
          <code>
            {`# Heading 1
## Heading 2
### Heading 3

**Bold text** and *italic text*

[Link to my website](https://example.com)
`}
          </code>
        </pre>

        <h2>Table of Contents</h2>
        <p>
          The Table of Contents component is automatically added to each blog
          post. It generates navigation based on your heading structure:
        </p>

        <pre>
          <code>
            {`<TableOfContents />
`}
          </code>
        </pre>

        <h2>Code Blocks</h2>
        <p>
          Use the CodeBlock component for syntax highlighting with optional
          features:
        </p>

        <pre>
          <code>
            {`<CodeBlock
  language="typescript"
  showLineNumbers={true}
  filename="example.ts"
>
{\`function greet(name: string): string {
  return \\\`Hello, \\\${name}!\\\`;
}

const user = "Reader";
console.log(greet(user));\`}
</CodeBlock>
`}
          </code>
        </pre>

        <p>
          You can also use standard markdown code blocks with backticks, and
          they'll be automatically transformed to use the CodeBlock component:
        </p>

        <pre>
          <code>
            {
              "\`\`\`typescript\nfunction example() {\n  return 'This works too!';\n}\n\`\`\`"
            }
          </code>
        </pre>

        <h2>Callouts and Notes</h2>
        <p>Use the Callout component to highlight important information:</p>

        <pre>
          <code>
            {`<Callout type="info" title="Information">
  This is an informational callout for providing additional context.
</Callout>

<Callout type="warning" title="Warning">
  This is a warning callout for potential issues.
</Callout>

<Callout type="error" title="Error">
  This is an error callout for critical issues.
</Callout>

<Callout type="tip" title="Tip">
  This is a tip callout for helpful suggestions.
</Callout>
`}
          </code>
        </pre>

        <h2>Images and Media</h2>
        <p>
          Use the CaptionedImage component for images with optional captions:
        </p>

        <pre>
          <code>
            {`<CaptionedImage
  src="/path/to/image.jpg"
  alt="Description of the image"
  width={600}
  height={400}
  caption="This is an optional caption for the image"
/>
`}
          </code>
        </pre>

        <p>
          Standard markdown image syntax will also be converted to
          CaptionedImage:
        </p>

        <pre>
          <code>
            {`![Alt text](/path/to/image.jpg)
`}
          </code>
        </pre>

        <p>For embedding videos:</p>

        <pre>
          <code>
            {`<VideoEmbed
  src="https://www.youtube.com/watch?v=VIDEO_ID"
  caption="Optional video caption"
/>
`}
          </code>
        </pre>

        <h2>Blockquotes and Citations</h2>
        <p>Use the Blockquote component for quotes with attribution:</p>

        <pre>
          <code>
            {`<Blockquote
  author="Albert Einstein"
  citation="Address to the Physical Society, Berlin, 1918"
>
  The most beautiful thing we can experience is the mysterious. It is
  the source of all true art and science.
</Blockquote>
`}
          </code>
        </pre>

        <p>Standard markdown blockquotes also work:</p>

        <pre>
          <code>
            {`> This is a standard blockquote.
`}
          </code>
        </pre>

        <h2>Lists</h2>
        <p>Use StylishList for enhanced listing with various styles:</p>

        <pre>
          <code>
            {`<StylishList type="disc">
  <StylishListItem>First item</StylishListItem>
  <StylishListItem>Second item</StylishListItem>
  <StylishListItem>Third item</StylishListItem>
</StylishList>

<StylishList type="number">
  <StylishListItem>First step</StylishListItem>
  <StylishListItem>Second step</StylishListItem>
  <StylishListItem>Third step</StylishListItem>
</StylishList>

<StylishList type="check" gap="loose">
  <StylishListItem>Completed task one</StylishListItem>
  <StylishListItem>Completed task two</StylishListItem>
  <StylishListItem>Completed task three</StylishListItem>
</StylishList>
`}
          </code>
        </pre>

        <p>Standard markdown lists are automatically styled:</p>

        <pre>
          <code>
            {`- First item
- Second item
- Third item

1. First numbered item
2. Second numbered item
3. Third numbered item
`}
          </code>
        </pre>

        <h2>Interactive Elements</h2>
        <p>Use Tabs for tabbed content:</p>

        <pre>
          <code>
            {`<Tabs
  items={[
    {
      label: "First Tab",
      content: "This is the content of the first tab.",
    },
    {
      label: "Second Tab",
      content: "This is the content of the second tab.",
    },
  ]}
/>
`}
          </code>
        </pre>

        <p>Use Accordion for expandable content:</p>

        <pre>
          <code>
            {`<Accordion>
  <AccordionItem title="First question?">
    Answer to the first question.
  </AccordionItem>
  <AccordionItem title="Second question?">
    Answer to the second question.
  </AccordionItem>
</Accordion>
`}
          </code>
        </pre>

        <h2>Layout Elements</h2>
        <p>Use Spacer for vertical spacing control:</p>

        <pre>
          <code>
            {`<Spacer size="small" />  {/* 1rem/16px */}
<Spacer size="medium" /> {/* 2rem/32px */}
<Spacer size="large" />  {/* 3rem/48px */}
<Spacer size="xl" />     {/* 4rem/64px */}
`}
          </code>
        </pre>

        <h2>Special Components</h2>

        <p>Use KeyboardShortcut to display keyboard commands:</p>

        <pre>
          <code>
            {`<KeyboardShortcut keys={["Ctrl", "C"]} description="Copy to clipboard" />
<KeyboardShortcut keys={["⌘", "S"]} description="Save file (macOS)" />
`}
          </code>
        </pre>

        <p>Use ColorSwatch to display color palettes:</p>

        <pre>
          <code>
            {`<ColorSwatch
  colors={[
    { color: "#ef4444", label: "Red", value: "#ef4444" },
    { color: "#3b82f6", label: "Blue", value: "#3b82f6" },
    { color: "#22c55e", label: "Green", value: "#22c55e" },
  ]}
/>
`}
          </code>
        </pre>

        <p>Use FileTree to display project structure:</p>

        <pre>
          <code>
            {`<FileTree
  data={[
    {
      name: "project-root",
      children: [
        {
          name: "src",
          isOpen: true,
          children: [
            { name: "components", children: [{ name: "Button.tsx" }] },
            { name: "utils.ts" },
          ],
        },
        { name: "README.md" },
      ],
    },
  ]}
/>
`}
          </code>
        </pre>

        <p>Use Timeline to display chronological events:</p>

        <pre>
          <code>
            {`<Timeline
  items={[
    {
      date: "June 2023",
      title: "First Event",
      description: "Description of what happened."
    },
    {
      date: "August 2023",
      title: "Second Event",
      description: "Details about this milestone."
    }
  ]}
/>
`}
          </code>
        </pre>

        <h2>Links</h2>
        <p>Various link components are available:</p>

        <pre>
          <code>
            {`<CardLink
  href="/path/or/url"
  title="Card Title"
  description="Card description text"
  external={true}
/>

<ResourceLink href="/docs">Documentation</ResourceLink>

<ReadMoreLink href="/blog">Read more posts</ReadMoreLink>
`}
          </code>
        </pre>

        <p>
          Standard markdown links to external sites are automatically converted
          to ExternalLink components:
        </p>

        <pre>
          <code>
            {`[External link to GitHub](https://github.com)
`}
          </code>
        </pre>
      </article>
    </section>
  );
}
