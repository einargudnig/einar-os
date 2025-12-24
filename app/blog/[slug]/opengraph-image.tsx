import { posts } from "@/.velite";
import { generateOGImage, ogImageContentType, ogImageSize } from "@/lib/og";
import { formatBlogDate } from "@/lib/utils";
import { notFound } from "next/navigation";

export const alt = "Blog Post";
export const size = ogImageSize;
export const contentType = ogImageContentType;

interface OGImageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Image({ params }: OGImageProps) {
  const { slug } = await params;
  const post = posts.find((post) => post.slug === slug);

  if (!post) {
    return notFound();
  }

  return generateOGImage({
    title: post.title,
    date: formatBlogDate(post.date),
    type: "blog",
  });
}

export async function generateStaticParams() {
  return posts.map((post) => ({
    slug: post.slug,
  }));
}
