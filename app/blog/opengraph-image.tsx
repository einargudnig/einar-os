import { generateOGImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const alt = "Blog - Einar Gudni";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  return generateOGImage({
    title: "Blog",
    description: "Thoughts on software, tech, and building things",
    type: "page",
  });
}
