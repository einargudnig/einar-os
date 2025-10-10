import { cn } from "@/lib/utils";
import Image from "next/image";

interface CaptionedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  className?: string;
  priority?: boolean;
}

export function CaptionedImage({
  src,
  alt,
  width,
  height,
  caption,
  className,
  priority = false,
}: CaptionedImageProps) {
  // Determine if this is a local or remote image
  const isRemoteImage = src.startsWith("http");

  return (
    <figure className={cn("my-8", className)}>
      {isRemoteImage ? (
        // Remote image with unoptimized prop
        <div className="overflow-hidden rounded-md">
          <Image
            src={src}
            alt={alt}
            width={width || 800}
            height={height || 450}
            className="w-full object-cover"
            unoptimized
            priority={priority}
          />
        </div>
      ) : (
        // Local image with optimization
        <div className="overflow-hidden rounded-md">
          <Image
            src={src}
            alt={alt}
            width={width || 800}
            height={height || 450}
            className="w-full object-cover"
            priority={priority}
          />
        </div>
      )}

      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
