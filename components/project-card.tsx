import { Badge } from "@/components/ui/badge";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export interface Project {
  title: string;
  description: string;
  href: string;
  tags: string[];
  external?: boolean;
}

export function ProjectCard({ title, description, href, tags, external = true }: Project) {
  const Wrapper = external ? "a" : Link;
  const linkProps = external
    ? { href, target: "_blank" as const, rel: "noopener noreferrer" }
    : { href };

  return (
    <Wrapper
      {...linkProps}
      className="group relative flex flex-col justify-between rounded-lg border border-border/50 p-5 transition-all hover:border-brand/30 hover:bg-muted/30"
    >
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold group-hover:text-brand transition-colors">
            {title}
          </h3>
          <ArrowTopRightIcon className="h-4 w-4 text-muted-foreground opacity-0 -translate-y-0.5 translate-x-0.5 transition-all group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0" />
        </div>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Badge key={tag} variant="outline" className="text-xs font-normal">
            {tag}
          </Badge>
        ))}
      </div>
    </Wrapper>
  );
}
