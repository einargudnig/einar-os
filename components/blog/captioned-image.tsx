import { cn } from "@/lib/utils";

interface CaptionedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  className?: string;
  priority?: boolean;
}

// Was next/image. MDX passes `src` as a runtime string pointing into public/,
// which astro:assets cannot optimise — that needs an imported ImageMetadata.
// Optimising these means moving blog images beside their content and using
// relative references; until then this is a plain <img>, so the local/remote
// split that existed only to toggle `unoptimized` is gone.
export function CaptionedImage({
  src,
  alt,
  width,
  height,
  caption,
  className,
  priority = false,
}: CaptionedImageProps) {
  return (
    <figure className={cn("my-8", className)}>
      <div className="overflow-hidden rounded-md">
        <img
          src={src}
          alt={alt}
          width={width || 800}
          height={height || 450}
          className="w-full object-cover"
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
        />
      </div>

      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
