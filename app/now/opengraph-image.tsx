import { generateOGImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const alt = "Now - Einar Gudni";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  return generateOGImage({
    title: "What I'm doing now",
    description: "Current projects, interests, and focus areas",
    type: "page",
  });
}
