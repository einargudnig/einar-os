import Link from "next/link";
import { learnings } from "@/.velite";
import { MDXContent } from "@/components/mdx-content";
import { formatBlogDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function Page() {
  const sorted = [...learnings].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <section className="mx-auto w-full max-w-2xl space-y-10 print:space-y-8 mb-8">
      <h1 className="font-bold text-3xl tracking-tight mb-5">Notes</h1>

      <div className="divide-y divide-border/50 stagger-list">
        {sorted.map((item) => (
          <div key={`${item.topic}-${item.date}`} className="py-8 first:pt-0">
            <article className="prose dark:prose-invert mb-3">
              <header className="mb-4">
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="text-brand font-mono">{item.topic}</span>
                  <span>·</span>
                  <time className="font-mono tabular-nums" dateTime={item.date}>{formatBlogDate(item.date)}</time>
                  {item.deepDiveSlug && (
                    <Link
                      href={`/deep-dive/${item.deepDiveSlug}`}
                      className="no-underline"
                    >
                      <Button size="sm" variant="outline">
                        Deep Dive
                      </Button>
                    </Link>
                  )}
                </div>
              </header>
              {"code" in item ? (
                <MDXContent code={item.code} enableTableOfContents={false} />
              ) : null}
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
