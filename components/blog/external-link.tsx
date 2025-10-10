import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";

export function ExternalLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center text-neutral-400 hover:underline group"
    >
      <span>{children}</span>
      <ArrowTopRightIcon className="ml-1 h-3 w-3 text-neutral-500 group-hover:scale-125 transition-transform duration-150" />
    </Link>
  );
}
