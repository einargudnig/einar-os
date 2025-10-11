import { deepDives } from "@/.velite";
import { MDXContent } from "@/components/mdx-content";
import { formatBlogDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import Balancer from "react-wrap-balancer";

interface DeepDiveParams {
  params: Promise<{
    slug: string;
  }>;
}

export default async function DeepDive({ params }: DeepDiveParams) {
  const { slug } = await params;
  const dive = deepDives.find((d) => d.slug === slug);

  if (!dive) return notFound();

  return (
    <section className="mx-auto w-full max-w-2xl space-y-8 print:space-y-6">
      <h1 className="font-bold text-3xl font-serif max-w-[650px]">
        <Balancer>{dive.title}</Balancer>
      </h1>
      <div className="grid grid-cols-[auto_1fr_auto] items-center mt-4 mb-8 font-mono text-sm max-w-[650px]">
        <div className="bg-neutral-800 rounded-md px-2 py-1 tracking-tighter">
          {formatBlogDate(dive.date)}
        </div>
        <div className="h-[0.2em] bg-neutral-800 mx-2" />
      </div>
      <article className="prose prose-invert">
        <MDXContent code={dive.code} />
      </article>
    </section>
  );
}

export function generateStaticParams() {
  return deepDives.map((d) => ({ slug: d.slug }));
}
