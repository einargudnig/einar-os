import { posts } from "../../../.velite";
import { MDXContent } from "../../../components/mdx-content";
import { notFound } from "next/navigation";

interface BlogPostParams {
  params: {
    slug: string;
  };
}

export default async function BlogPost({ params }: BlogPostParams) {
  const post = posts.find((post) => post.slug === params.slug);
  // console.log("in slug route", post);

  if (!post) {
    return notFound();
  }

  return (
    <article className="container py-8">
      <h1 className="text-3xl font-bold mb-6">{post.title}</h1>
      <div className="prose prose-lg max-w-none">
        <MDXContent code={post.code} />
      </div>
    </article>
  );
}

// Generate static paths at build time
export function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
