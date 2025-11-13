import { Github, Twitter } from "lucide-react";
import Link from "next/link";

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
  return (
    <nav className="mx-auto w-full max-w-2xl space-y-8 print:space-y-6">
      <aside className="-ml-[8px] mb-16 tracking-tight">
        <div className="lg:sticky lg:top-20">
          <nav className="px-0 pb-0 fade scroll-pr-6" id="nav">
            <div className="flex justify-between items-center">
              <div className="flex items-center flex-row-reverse md:flex-row">
                <div className="md:flex flex-row space-x-0 pr-1 hidden">
                  {Object.entries(navItems).map(([path, { name }]) => {
                    return (
                      <Link
                        key={path}
                        href={path}
                        className="transition-all hover:text-neutral-2 flex align-middle relative py-1 px-2"
                      >
                        {name}
                      </Link>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-x-3">
                <Link
                  href="https://github.com/einargudnig"
                  className="text-neutral-500 hover:text-neutral-400"
                >
                  <Github size={20} />
                </Link>
                <Link
                  href="https://x.com/einargudni"
                  className="text-neutral-500 hover:text-neutral-400"
                >
                  <Twitter size={20} />
                </Link>
              </div>
            </div>
          </nav>
        </div>
      </aside>
    </nav>
  );
}
