import { Separator } from "@radix-ui/react-separator";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <section className="mx-auto w-full max-w-2xl space-y-8 print:space-y-6 mb-8">
      <h1 className="font-semibold text-2xl font-serif mb-5">Someday</h1>
      <div className="prose prose-neutral dark:prose-invert text-neutral-200">
        <p className="text-neutral-500 text-lg font-mono">
          Someday, I want to work at my dream company
        </p>
        <p>
          I really don&apos;t know what my dream company is, but I want to work
          at a place where I can learn a lot, have fun and be surrounded by
          great people. I want to be in a place where I can grow and be
          challenged. In someways my current company matches all of these
          things, but I still early in my career and there are lot of great
          companies out there.
        </p>
      </div>
      <Separator />
      <div className="prose prose-neutral dark:prose-invert text-neutral-200">
        <p className="text-neutral-500 text-lg font-mono">
          Someday, I want to live abroad
        </p>
        <p>
          Iceland is great, has it pros and it&apos;s cons, like all places. But
          I would like to try to live abroad sometime, preferably somewhere
          warmer
        </p>
      </div>
      <Separator />
      <div className="prose prose-neutral dark:prose-invert text-neutral-200">
        <p className="text-neutral-500 text-lg font-mono">
          Someday, I want to speak a tech conference
        </p>
        <p>
          I have been to a few conferences, and I think it would be fun
          challenge to speak at one. I have to prepare, practice and do
          uncomfortable things to get there. It also means I need to know the
          stuff I will be talking about!
        </p>
      </div>
      <Separator />
      <div className="prose prose-neutral dark:prose-invert text-neutral-200">
        <p className="text-neutral-500 text-lg font-mono">
          Someday, I want to learn to fly
        </p>
        <p>
          Not that I want to become a pilot and work as one. Airplanes, flight
          and the sky has always fascinated me. I think it would be fun to learn
          to fly.
        </p>
      </div>
      <Separator />
      <div className="prose prose-neutral dark:prose-invert text-neutral-200">
        <p className="text-neutral-500 text-lg font-mono">
          Someday, I want to work because I want to
        </p>
        <p>
          I want to be at the place where I work because I do it for fun, not
          because it pays the salary. Of course the &quot;salary&quot; has to
          come way, but I want to be in the situation where I can choose where
          and if I work because I want to, not because I have to.
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
