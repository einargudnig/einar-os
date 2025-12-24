import { generateOGImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const alt = "Learnings - Einar Gudni";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  return generateOGImage({
    title: "Learnings",
    description: "Things I've learned along the way",
    type: "page",
  });
}
