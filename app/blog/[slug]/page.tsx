import { posts } from "@/.velite";
import { MDXContent } from "@/components/mdx-content";
import { formatBlogDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import Balancer from "react-wrap-balancer";

interface BlogPostParams {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPost({ params }: BlogPostParams) {
  const { slug } = await params;
  const post = posts.find((post) => post.slug === slug);
  // console.log("in slug route", post);

  if (!post) {
    return notFound();
  }

  return (
    <section className="mx-auto w-full max-w-2xl space-y-8 print:space-y-6">
      <div>
        <h1 className="font-bold text-3xl md:text-4xl tracking-tight max-w-[650px] leading-tight">
          <Balancer>{post.title}</Balancer>
        </h1>
        <div className="flex items-center gap-3 mt-4 mb-8">
          <div className="font-mono text-sm text-muted-foreground tabular-nums tracking-tighter">
            {formatBlogDate(post.date)}
          </div>
          <div className="h-px flex-1 bg-border/50" />
        </div>
      </div>
      <article className="prose dark:prose-invert max-w-[65ch] leading-relaxed">
        <MDXContent code={post.code} draft={post.draft} />
      </article>
    </section>
  );
}

// Generate static paths at build time
export function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
