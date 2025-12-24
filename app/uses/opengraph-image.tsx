import { generateOGImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const alt = "Uses - Einar Gudni";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  return generateOGImage({
    title: "Uses",
    description: "My tools, setup, and tech stack",
    type: "page",
  });
}
