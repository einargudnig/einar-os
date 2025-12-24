import { generateOGImage, ogImageContentType, ogImageSize } from "@/lib/og";

export const alt = "Einar Gudni - My home on the web";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  return generateOGImage({
    title: "Einar Gudni",
    description: "My home on the web",
  });
}
