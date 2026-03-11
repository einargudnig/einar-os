import { posts } from "../../.velite";
import Link from "next/link";
import { formatBlogDate } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PencilLine } from "lucide-react";

export default function Page() {
  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <section className="mx-auto w-full space-y-8 print:space-y-6 mb-8">
      <h1 className="font-bold text-3xl tracking-tight mb-5">Blog</h1>

      <div className="grid stagger-list">
        {sortedPosts.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-lg text-muted-foreground">No posts yet.</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Check back soon.</p>
          </div>
        )}
        {sortedPosts.map((post) => (
          <div key={post.slug} className="group border-b border-border/50 last:border-b-0">
            <h2 className="text-lg">
              <Link
                href={`/blog/${post.slug}`}
                className="flex items-center justify-between py-3 px-2 -mx-2 rounded-md transition-colors hover:bg-muted/50"
              >
                <p className="text-foreground group-hover:text-brand transition-colors mr-1">{post.title}</p>
                <p className="ml-1 text-sm font-mono tabular-nums text-muted-foreground shrink-0">
                  {formatBlogDate(post.date)}
                </p>
              </Link>
            </h2>
          </div>
        ))}
        <Alert variant="default" className="mt-4">
          <PencilLine />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            I have written more posts over the years, I'm in the process of
            migrating them to this new page.
          </AlertDescription>
        </Alert>
      </div>
    </section>
  );
}
