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
      <h1 className="font-bold text-3xl font-serif max-w-[650px]">
        <Balancer>{post.title}</Balancer>
      </h1>
      <div className="grid grid-cols-[auto_1fr_auto] items-center mt-4 mb-8 font-mono text-sm max-w-[650px]">
        <div className="bg-neutral-800 rounded-md px-2 py-1 tracking-tighter">
          {formatBlogDate(post.date)}
        </div>
        <div className="h-[0.2em] bg-neutral-800 mx-2" />
      </div>
      <article className="prose prose-invert">
        <MDXContent code={post.code} />
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
