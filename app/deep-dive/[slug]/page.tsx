import { deepDives } from "@/.velite";
import { MDXContent } from "@/components/mdx-content";
import { formatBlogDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import { Balancer } from "react-wrap-balancer";

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
      <div>
        <h1 className="font-bold text-3xl md:text-4xl tracking-tight max-w-[650px] leading-tight">
          <Balancer>{dive.title}</Balancer>
        </h1>
        <div className="flex items-center gap-3 mt-4 mb-8">
          <div className="font-mono text-sm text-muted-foreground tabular-nums tracking-tighter">
            {formatBlogDate(dive.date)}
          </div>
          <div className="h-px flex-1 bg-border/50" />
        </div>
      </div>
      <article className="prose dark:prose-invert max-w-[65ch] leading-relaxed">
        <MDXContent code={dive.code} draft={dive.draft} />
      </article>
    </section>
  );
}

export function generateStaticParams() {
  return deepDives.map((d) => ({ slug: d.slug }));
}
