import { cn } from "@/lib/utils";

interface VideoEmbedProps {
  src: string;
  title?: string;
  className?: string;
  aspectRatio?: "16:9" | "4:3" | "1:1" | "vertical" | "custom";
  width?: number;
  height?: number;
  caption?: string;
}

export function VideoEmbed({
  src,
  title,
  className,
  aspectRatio = "16:9",
  width,
  height,
  caption,
}: VideoEmbedProps) {
  // Helper function to determine if this is a YouTube video
  const isYouTube = (url: string): boolean => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  // Helper function to get YouTube embed URL
  const getYouTubeEmbedUrl = (url: string): string => {
    // Handle youtu.be links
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    // Handle regular youtube.com links
    if (url.includes("watch?v=")) {
      const id = url.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    // If it's already an embed URL, return as is
    if (url.includes("youtube.com/embed/")) {
      return url;
    }

    // Default fallback
    return url;
  };

  // Aspect ratio styles
  const aspectRatioClasses = {
    "16:9": "aspect-w-16 aspect-h-9",
    "4:3": "aspect-w-4 aspect-h-3",
    "1:1": "aspect-w-1 aspect-h-1",
    vertical: "aspect-w-9 aspect-h-16",
    custom: "",
  };

  // Process the source URL
  const embedSrc = isYouTube(src) ? getYouTubeEmbedUrl(src) : src;

  return (
    <figure className={cn("my-8", className)}>
      <div
        className={cn(
          "overflow-hidden rounded-lg bg-muted",
          aspectRatio !== "custom" && aspectRatioClasses[aspectRatio],
        )}
        style={
          aspectRatio === "custom" && width && height
            ? {
                width: `${width}px`,
                height: `${height}px`,
              }
            : {}
        }
      >
        {isYouTube(src) ? (
          <iframe
            src={embedSrc}
            title={title || "YouTube video player"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        ) : (
          <video src={src} controls className="w-full h-full" title={title} />
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
