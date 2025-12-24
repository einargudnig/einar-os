import { deepDives } from "@/.velite";
import { generateOGImage, ogImageContentType, ogImageSize } from "@/lib/og";
import { formatBlogDate } from "@/lib/utils";
import { notFound } from "next/navigation";

export const alt = "Deep Dive";
export const size = ogImageSize;
export const contentType = ogImageContentType;

interface OGImageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function Image({ params }: OGImageProps) {
  const { slug } = await params;
  const dive = deepDives.find((d) => d.slug === slug);

  if (!dive) {
    return notFound();
  }

  return generateOGImage({
    title: dive.title,
    date: formatBlogDate(dive.date),
    type: "deep-dive",
  });
}

export async function generateStaticParams() {
  return deepDives.map((d) => ({
    slug: d.slug,
  }));
}
