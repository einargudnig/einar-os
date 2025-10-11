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
      <h1 className="font-bold text-2xl font-serif mb-5">Learnings</h1>

      <div className="space-y-16">
        {sorted.map((item) => (
          <article
            key={`${item.topic}-${item.date}`}
            className="prose prose-invert"
          >
            <header className="mb-4">
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <div className="text-sm text-neutral-500 flex items-center gap-2">
                <span>{item.topic}</span>
                <span className="mx-2">·</span>
                <time dateTime={item.date}>{formatBlogDate(item.date)}</time>
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
        ))}
      </div>
    </section>
  );
}
