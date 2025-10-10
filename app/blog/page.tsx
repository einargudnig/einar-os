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
    <section className="mx-auto w-full max-w-2xl space-y-8 print:space-y-6 mb-8">
      <h1 className="font-bold text-2xl font-serif mb-5">Blog</h1>

      <div className="grid">
        {sortedPosts.map((post) => (
          <div key={post.slug} className="p-2">
            <h2 className="text-lg">
              <Link
                href={`/blog/${post.slug}`}
                className="text-neutral-500 hover:text-neutral-400"
              >
                <div className="flex items-center justify-between">
                  <p className="hover:underline mr-1">{post.title}</p>
                  <p className="ml-1 text-sm text-neutral-600">
                    {formatBlogDate(post.date)}
                  </p>
                </div>
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
