import { ExternalLink } from "@/components/blog/external-link";
import { LifeOs } from "@/components/life-os";
import { LifeOsFeeds } from "@/components/life-os-feeds";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <section className="mx-auto w-full max-w-2xl space-y-8 print:space-y-6 mb-8">
      <div>
        <h1 className="font-semibold text-3xl tracking-tight">Now</h1>
        <p className="mt-1 text-sm font-mono text-muted-foreground">Updated 12. Jan, 2026</p>
      </div>
      <div className="prose prose-neutral dark:prose-invert text-pretty">
        <p className="text-brand text-lg font-mono">Baby</p>
        <p className="leading-relaxed max-w-[65ch]">
          Expecting our first baby this June! Super exciting and scary at the
          same time. One of things you can't get a lot of practice with
          beforehand.
        </p>
      </div>
      <div className="h-px bg-border/50" />
      <div className="prose prose-neutral dark:prose-invert text-pretty">
        <p className="text-brand text-lg font-mono">HYROX</p>
        <p className="leading-relaxed max-w-[65ch]">
          Back training for a HYROX competition in March 2026. This time it will
          be Pro Singles. The goal is to finish under 1:15:00. We just started a
          six weeks peak training block.
        </p>
      </div>
      <div className="h-px bg-border/50" />
      <div className="prose prose-neutral dark:prose-invert text-pretty">
        <p className="text-brand text-lg font-mono">Reading</p>
        <p className="leading-relaxed max-w-[65ch]">
          I am listening to{" "}
          <ExternalLink href="https://www.goodreads.com/book/show/204567.The_Expectant_Father?from_search=true&from_srp=true&qid=mAwSnMYB4F&rank=1">
            The Expectant Father: Facts, Tips and Advices for Dads-to-be
          </ExternalLink>{" "}
          It's time to prepare!
        </p>
      </div>
      <div className="h-px bg-border/50" />
      <LifeOs />
      <LifeOsFeeds />
      <div className="flex justify-start">
        <Link href="/" className="p-2 -m-2 text-muted-foreground hover:text-brand transition-colors">
          <ArrowLeft />
        </Link>
      </div>
    </section>
  );
}
