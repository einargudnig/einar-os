import Link from "next/link";
import { CardLink } from "@/components/blog/link-components";
import { ArrowLeft } from "lucide-react";

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
        Blog Component Documentation
      </h1>

      <div className="prose prose-invert">
        <p className="text-lg">
          This blog platform includes a rich set of custom components designed
          to enhance your content creation experience. Use these tools to create
          engaging, interactive blog posts with minimal effort.
        </p>

        <div className="grid gap-6 mt-8">
          <CardLink
            href="/components-demo"
            title="Component Demo"
            description="See all components in action with live examples"
          />

          <CardLink
            href="/component-docs"
            title="Component Documentation"
            description="Learn how to use components in your MDX blog posts"
          />
        </div>

        <h2 className="mt-8">Getting Started</h2>
        <p>To create rich blog posts using these components:</p>

        <ol>
          <li>
            Create a new MDX file in the <code>content/posts/</code> directory
          </li>
          <li>Add your frontmatter with title, date, and other metadata</li>
          <li>Write your content using Markdown and the custom components</li>
          <li>Use the documentation as a reference for component options</li>
        </ol>

        <h2 className="mt-6">Key Features</h2>
        <ul>
          <li>Automatic syntax highlighting for code blocks</li>
          <li>Styled blockquotes with attribution</li>
          <li>Information callouts for warnings, tips, and notes</li>
          <li>Interactive components like tabs and accordions</li>
          <li>Media components for images, videos, and more</li>
          <li>Layout tools for better content organization</li>
          <li>Special components for technical documentation</li>
        </ul>
      </div>
    </section>
  );
}
