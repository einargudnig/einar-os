import { generateOGImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const alt = "Notes - Einar Gudni";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  return generateOGImage({
    title: "Notes",
    description: "Quick thoughts and ideas",
    type: "page",
  });
}
