import { generateOGImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const alt = "About - Einar Gudni";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  return generateOGImage({
    title: "About Me",
    description: "Software engineer, builder, and lifelong learner",
    type: "page",
  });
}
