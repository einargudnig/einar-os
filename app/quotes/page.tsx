import { quotes } from "@/.velite";
import { MDXContent } from "@/components/mdx-content";
import { formatBlogDate } from "@/lib/utils";

export default function Page() {
  const sorted = [...quotes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <section className="mx-auto w-full max-w-2xl space-y-10 print:space-y-8 mb-8">
      <h1 className="font-bold text-3xl tracking-tight mb-5">Quotes</h1>

      <div className="divide-y divide-border/50 stagger-list">
        {sorted.map((quote) => (
          // `author` + `date` alone aren't guaranteed unique (a single author
          // can be quoted more than once on the same day), so `text` is
          // included to disambiguate — two distinct quotes never share text.
          <div key={`${quote.author}-${quote.date}-${quote.text}`} className="py-8 first:pt-0 last:pb-0">
            <article>
              <blockquote className="border-l-2 border-brand pl-4 italic text-lg leading-relaxed max-w-[65ch]">
                &ldquo;{quote.text}&rdquo;
              </blockquote>
              <div className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
                <span className="font-medium text-foreground">
                  {quote.author}
                </span>
                {quote.source && (
                  <>
                    <span className="mx-1">·</span>
                    <span>{quote.source}</span>
                  </>
                )}
                <span className="mx-1">·</span>
                <time className="font-mono tabular-nums" dateTime={quote.date}>{formatBlogDate(quote.date)}</time>
              </div>
              {"code" in quote && quote.code ? (
                <div className="mt-4 text-sm text-muted-foreground">
                  <MDXContent code={quote.code} enableTableOfContents={false} />
                </div>
              ) : null}
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
