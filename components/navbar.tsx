"use client";

import { Github, Twitter } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { KeyboardHint } from "@/components/keyboard-hint";

const navItems = {
  "/": {
    name: "home",
  },
  "/uses": {
    name: "uses",
  },
  "/blog": {
    name: "blog",
  },
  "/notes": {
    name: "notes",
  },
};

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="mx-auto w-full space-y-8 print:space-y-6">
      <aside className="mb-16 tracking-tight">
        <div className="lg:sticky lg:top-20">
          <nav className="pb-4 border-b border-border/50" id="nav">
            <div className="flex justify-between items-center">
              <div className="flex items-center flex-row-reverse md:flex-row">
                <div className="flex flex-row gap-x-1">
                  {Object.entries(navItems).map(([path, { name }]) => {
                    const isActive =
                      path === "/"
                        ? pathname === "/"
                        : pathname.startsWith(path);

                    return (
                      <Link
                        key={path}
                        href={path}
                        className={cn(
                          "transition-colors flex align-middle relative py-1 px-2 rounded-md",
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-brand hover:bg-muted/50",
                        )}
                      >
                        {name}
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-x-3">
                <KeyboardHint />
                <Link
                  href="https://github.com/einargudnig"
                  className="text-muted-foreground hover:text-brand transition-colors"
                >
                  <Github size={20} strokeWidth={1.5} />
                </Link>
                <Link
                  href="https://x.com/einargudni"
                  className="text-muted-foreground hover:text-brand transition-colors"
                >
                  <Twitter size={20} strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </aside>
    </nav>
  );
}
