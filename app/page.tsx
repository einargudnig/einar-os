import { Section } from "@/components/section";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/project-card";
import { GitHubContributions } from "@/components/github-contributions";
import { GlobeIcon } from "lucide-react";
import Link from "next/link";
import { posts } from "@/.velite";
import { formatBlogDate } from "@/lib/utils";

const projects = [
  {
    title: "jstop",
    description:
      "A terminal-based system monitor built in JavaScript. Like htop, but for your Node.js toolkit.",
    href: "https://github.com/einargudnig/jstop",
    tags: ["Node.js", "CLI", "Terminal"],
  },
  {
    title: "ts-mini",
    description:
      "Interactive visualization of the TypeScript compiler pipeline. Explore how code gets scanned, parsed, and emitted.",
    href: "/ts-mini",
    tags: ["TypeScript", "React", "Shiki"],
    external: false,
  },
  {
    title: "dotfiles",
    description:
      "My personal development environment. Neovim, tmux, zsh, and macOS configuration managed with care.",
    href: "https://github.com/einargudnig/dotfiles",
    tags: ["Neovim", "Zsh", "macOS"],
  },
  {
    title: "einar-os",
    description:
      "This site. Built with Next.js 16, Velite for MDX content, and Tailwind v4. Deployed on Vercel.",
    href: "https://github.com/einargudnig/einar-os",
    tags: ["Next.js", "MDX", "Tailwind"],
  },
  {
    title: "todo-system",
    description:
      "A CLI-powered task management system with Taskwarrior, syncing to Things 3 and Asana.",
    href: "https://github.com/einargudnig/todo-system",
    tags: ["CLI", "Taskwarrior", "Productivity"],
  },
  {
    title: "baby",
    description:
      "A countdown and tracker for the newest member of the family.",
    href: "/baby",
    tags: ["Next.js", "Fun"],
    external: false,
  },
];

export default function Home() {
  const work = [
    {
      company: "Maul",
      link: "https://maul.is",
      badges: [],
      title: "Software Developer",
      logo: "",
      start: "2020",
      end: "Present",
      stack: ["React", "Tailwind", "AWS"],
    },
    {
      company: "Tiffin",
      link: "https://tiffin.dk",
      badges: ["Remote"],
      title: "Software Developer",
      logo: "",
      start: "2022",
      end: "2024",
      stack: ["React", "Tailwind", "AWS"],
    },
    {
      company: "Contractor",
      link: "https://einargudni.com",
      badges: ["Remote"],
      title: "Software Developer",
      logo: "",
      start: "2022",
      end: "Present",
      stack: [
        "JavaScript",
        "TypeScript",
        "React/Next.js/Remix",
        "Tailwind",
        "Chakra-Ui",
        "Node.js",
        "AWS",
      ],
    },
  ];

  return (
    <section className="mx-auto w-full space-y-8">
      <div className="grid md:grid-cols-[2fr_1fr] gap-8 items-end">
        <div className="space-y-3 stagger-list">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter leading-none">Einar Gudni</h1>
          <p className="max-w-[65ch] text-lg text-muted-foreground leading-relaxed">
            <span className="italic font-semibold text-foreground">Curious</span>, Tinkerer, Late
            bloomer & Nerd
          </p>
          <p className="items-center text-pretty font-mono text-xs text-muted-foreground">
            <a
              className="inline-flex gap-x-1.5 align-baseline leading-none hover:text-brand transition-colors"
              href="https://www.google.com/maps/place/Reykjavík"
              target="_blank"
              rel="noreferrer"
            >
              <GlobeIcon className="h-3 w-3" />
              Reykjavík, Iceland
            </a>
          </p>
        </div>
      </div>
      <Section className="mt-4">
        <div className="flex items-center justify-between">
          <Link href="/about" className="group rounded-md px-4 py-3 -mx-4 transition-colors hover:bg-muted/50">
            <p className="text-lg font-medium group-hover:text-brand transition-colors">
              About
            </p>
            <p className="text-sm text-muted-foreground">
              Who, What, Why
            </p>
          </Link>
          <Link href="/now" className="group rounded-md px-4 py-3 -mx-4 transition-colors hover:bg-muted/50">
            <p className="text-lg font-medium group-hover:text-brand transition-colors">
              Now
            </p>
            <p className="text-sm text-muted-foreground">
              Short-term focus
            </p>
          </Link>
          <Link href="/someday" className="group rounded-md px-4 py-3 -mx-4 transition-colors hover:bg-muted/50">
            <p className="text-lg font-medium group-hover:text-brand transition-colors">
              Someday
            </p>
            <p className="text-sm text-muted-foreground">
              Long-term focus
            </p>
          </Link>
        </div>
      </Section>

      <Section className="mt-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-bold">Newest Writing</h2>
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-brand transition-colors">
            all writing &rarr;
          </Link>
        </div>
        {(() => {
          const latest = posts
            .filter((p) => !p.draft)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
          if (!latest) return null;
          return (
            <Link href={latest.permalink} className="group block border-t border-border/50 pt-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                  <p className="font-semibold text-lg group-hover:text-brand transition-colors">{latest.title}</p>
                  {latest.excerpt && (
                    <p className="text-muted-foreground leading-relaxed max-w-[65ch]">
                      {latest.excerpt}
                    </p>
                  )}
                </div>
                <p className="font-mono text-sm tabular-nums text-muted-foreground shrink-0 ml-4">
                  {formatBlogDate(latest.date)}
                </p>
              </div>
            </Link>
          );
        })()}
      </Section>

      <Section className="mt-4">
        <h2 className="text-xl font-bold">Projects</h2>
        <div className="grid md:grid-cols-2 gap-3 stagger-list">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </Section>

      <Section className="mt-4">
        <h2 className="text-xl font-bold">Activity</h2>
        <GitHubContributions username="einargudnig" />
      </Section>

      <Section className="mt-4">
        <h2 className="text-xl font-bold">Work Experience</h2>
        <div className="divide-y divide-border/50 stagger-list">
          {work.map((job) => (
            <div key={job.company} className="py-4 first:pt-0">
              <div className="flex items-center justify-between gap-x-2 text-base">
                <h3 className="inline-flex items-center gap-x-2 font-semibold leading-none">
                  <a className="hover:text-brand transition-colors" href={job.link}>
                    {job.company}
                  </a>
                  {job.badges.map((badge) => (
                    <Badge
                      variant="secondary"
                      className="text-xs"
                      key={badge}
                    >
                      {badge}
                    </Badge>
                  ))}
                </h3>
                <div className="text-sm font-mono tabular-nums text-muted-foreground">
                  {job.start} - {job.end}
                </div>
              </div>
              <p className="font-mono text-sm text-muted-foreground mt-1">{job.title}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {job.stack.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </section>
  );
}
