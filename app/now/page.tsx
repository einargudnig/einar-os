import { ExternalLink } from "@/components/blog/external-link";
import { Separator } from "@radix-ui/react-separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <section className="mx-auto w-full max-w-2xl space-y-8 print:space-y-6 mb-8">
      <h1 className="font-semibold text-2xl font-serif">Now</h1>
      <div className="flex flex-col">
        <p className="-mt-4 text-neutral-500">Updated 08. Nov, 2025</p>
      </div>
      <div className="prose prose-neutral dark:prose-invert text-neutral-200">
        <p className="text-neutral-500 text-lg font-mono">Writing</p>
        <p>
          I made some updates to my homepage. Simplified it a lot. I had set up
          a specific project on Astro to handle my writings. It was a fun
          experiment but I didn&apos;t like having separate projects. Now I have
          moved everything back and I will continue to add things here.
        </p>
      </div>
      <Separator />
      <div className="prose prose-neutral dark:prose-invert text-neutral-200">
        <p className="text-neutral-500 text-lg font-mono">Fundamentals</p>
        <p>
          I feel like I have some holes in the fundamentals when I am writing
          code, it slows my annoyingly down. I will spend time on this to
          improve. This is super important to me. I feel like I&apos;ve made
          some progress here, recently I have been diving into TypeScript.
        </p>
      </div>
      <Separator />
      <div className="prose prose-neutral dark:prose-invert text-neutral-200">
        <p className="text-neutral-500 text-lg font-mono">Reading</p>
        <p>
          I am listening to{" "}
          <ExternalLink href="https://www.goodreads.com/book/show/17994.The_Code_Book">
            The Code Book: Science of Secrecy from Ancient Egypt to Quantum
            Cryptography
          </ExternalLink>{" "}
          I just started but it seems super interesting so far!
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
