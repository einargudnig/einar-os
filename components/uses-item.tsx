import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface UsesItemProps {
  name: string;
  href?: string;
  description?: string;
}

export function UsesItem({ name, href, description }: UsesItemProps) {
  const content = (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-baseline gap-2 min-w-0">
        <span className={cn(href && "group-hover:text-brand transition-colors")}>
          {name}
        </span>
        {description && (
          <span className="text-sm text-muted-foreground truncate hidden sm:inline">
            {description}
          </span>
        )}
      </div>
      {href && (
        <ArrowTopRightIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </div>
  );

  if (href) {
    const isExternal = href.startsWith("http");
    const Comp = isExternal ? "a" : Link;
    const linkProps = isExternal
      ? { href, target: "_blank" as const, rel: "noopener noreferrer" }
      : { href };

    return (
      <li>
        <Comp
          {...linkProps}
          className="group flex py-2 px-2 -mx-2 rounded-md transition-colors hover:bg-muted/50"
        >
          {content}
        </Comp>
      </li>
    );
  }

  return (
    <li className="py-2 px-2 -mx-2">
      {content}
    </li>
  );
}

export function UsesList({ children }: { children: React.ReactNode }) {
  return (
    <ul className="divide-y divide-border/50">
      {children}
    </ul>
  );
}
