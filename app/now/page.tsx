import { ExternalLink } from "@/components/blog/external-link";
import { Separator } from "@radix-ui/react-separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <section className="mx-auto w-full max-w-2xl space-y-8 print:space-y-6 mb-8">
      <h1 className="font-semibold text-2xl font-serif">Now</h1>
      <div className="flex flex-col">
        <p className="-mt-4 text-neutral-500">Updated 12. Jan, 2026</p>
      </div>
      <div className="prose prose-neutral dark:prose-invert text-neutral-200">
        <p className="text-neutral-500 text-lg font-mono">Baby</p>
        <p>
          Expecting our first baby this June! Super exciting and scary at the
          same time. One of things you can't get a lot of practice with
          beforehand.
        </p>
      </div>
      <Separator />
      <div className="prose prose-neutral dark:prose-invert text-neutral-200">
        <p className="text-neutral-500 text-lg font-mono">HYROX</p>
        <p>
          Back training for a HYROX competition in March 2026. This time it will
          be Pro Singles. The goal is to finish under 1:15:00. We just started a
          six weeks peak training block.
        </p>
      </div>
      <Separator />
      <div className="prose prose-neutral dark:prose-invert text-neutral-200">
        <p className="text-neutral-500 text-lg font-mono">Reading</p>
        <p>
          I am listening to{" "}
          <ExternalLink href="https://www.goodreads.com/book/show/204567.The_Expectant_Father?from_search=true&from_srp=true&qid=mAwSnMYB4F&rank=1">
            The Expectant Father: Facts, Tips and Advices for Dads-to-be
          </ExternalLink>{" "}
          It's time to prepare!
        </p>
      </div>
      <div className="flex justify-start">
        <Link href="/" className="mr-2 p-2 -m-2">
          <ArrowLeft className="text-neutral-500" />
        </Link>
      </div>
    </section>
  );
}
