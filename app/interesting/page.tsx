import { interesting } from "@/.velite";
import { MDXContent } from "@/components/mdx-content";
import { formatBlogDate } from "@/lib/utils";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";

export const metadata = {
  title: "Interesting",
  description: "A collection of whatever I find genuinely interesting.",
};

export default function Page() {
  const sorted = [...interesting].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <section className="mx-auto w-full max-w-2xl space-y-10 print:space-y-8 mb-8">
      <header>
        <h1 className="font-bold text-3xl tracking-tight mb-2">Interesting</h1>
        <p className="text-muted-foreground">
          Whatever is interesting. Facts, links, videos, thoughts — anything
          that made me curious.
        </p>
      </header>

      <div className="divide-y divide-border/50 stagger-list">
        {sorted.map((item) => (
          <div key={`${item.title}-${item.date}`} className="py-8 first:pt-0">
            <article className="prose dark:prose-invert mb-3">
              <header className="mb-4">
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <time className="font-mono tabular-nums" dateTime={item.date}>
                    {formatBlogDate(item.date)}
                  </time>
                  {item.tags && item.tags.length > 0 && (
                    <>
                      <span>·</span>
                      {item.tags.map((tag) => (
                        <span key={tag} className="text-brand/70 font-mono">
                          {tag}
                        </span>
                      ))}
                    </>
                  )}
                </div>
              </header>
              <MDXContent code={item.code} enableTableOfContents={false} />
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 text-sm text-brand no-underline hover:underline"
                >
                  source
                  <ArrowTopRightIcon className="h-3.5 w-3.5 transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              )}
            </article>
          </div>
        ))}
        {sorted.length === 0 && (
          <p className="text-muted-foreground text-sm py-8">
            Nothing here yet.
          </p>
        )}
      </div>
    </section>
  );
}
