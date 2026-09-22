import { createFileRoute } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";

function RouteComponent() {
  return (
    <div>
      <Image src="/images/desk.png" alt="Desk" className="rounded-md" preload />
      <p className="mt-3 text-xs text-muted-foreground">
        Point and shoot photo of the current setup
      </p>
    </div>
  );
}

export const Route = createFileRoute("/uses/")({
  head: () => ({
    meta: [
      { title: "Uses — Einar Gudni" },
      { name: "description", content: "My tools, setup, and tech stack" },
      { property: "og:title", content: "Uses" },
      { property: "og:description", content: "My tools, setup, and tech stack" },
      { property: "og:image", content: "/og/uses.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/og/uses.png" },
    ],
  }),
  component: RouteComponent,
});
