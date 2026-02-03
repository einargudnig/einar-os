import { quotes } from "@/.velite";
import { MDXContent } from "@/components/mdx-content";
import { formatBlogDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  const sorted = [...quotes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <section className="mx-auto w-full max-w-2xl space-y-10 print:space-y-8 mb-8">
      <h1 className="font-bold text-2xl font-serif mb-5">Quotes</h1>

      <div className="space-y-12">
        {sorted.map((quote, index) => (
          <div key={`${quote.author}-${quote.date}-${index}`}>
            <article className="prose prose-invert">
              <blockquote className="border-l-4 border-neutral-600 pl-4 italic text-lg">
                "{quote.text}"
              </blockquote>
              <div className="text-sm text-neutral-500 mt-3 flex items-center gap-2">
                <span className="font-medium text-neutral-400">
                  {quote.author}
                </span>
                {quote.source && (
                  <>
                    <span className="mx-1">·</span>
                    <span>{quote.source}</span>
                  </>
                )}
                <span className="mx-1">·</span>
                <time dateTime={quote.date}>{formatBlogDate(quote.date)}</time>
              </div>
              {"code" in quote && quote.code ? (
                <div className="mt-4 text-sm text-neutral-400">
                  <MDXContent code={quote.code} enableTableOfContents={false} />
                </div>
              ) : null}
            </article>
            {index < sorted.length - 1 && <Separator className="mt-8" />}
          </div>
        ))}
      </div>
    </section>
  );
}
