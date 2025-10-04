import { posts } from "../../.velite";
import Link from "next/link";

export default function Page() {
  console.log("blog route", posts);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Blog</h1>
      <div className="grid gap-4">
        {posts.map((post) => (
          <div
            key={post.slug}
            className="p-4 border rounded-lg hover:bg-gray-50"
          >
            <h2 className="text-xl font-semibold mb-2">
              <Link
                href={`/blog/${post.slug}`}
                className="text-blue-600 hover:underline"
              >
                {post.title}
              </Link>
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}
