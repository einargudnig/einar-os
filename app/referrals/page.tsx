import { ExternalLink } from "@/components/blog/external-link";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const referrals = [
  {
    name: "Raycast",
    description: "The best macOS productivity app.",
    url: "https://raycast.com/?via=einar",
  },
];

export default function Page() {
  return (
    <section className="mx-auto w-full max-w-2xl space-y-8 print:space-y-6 mb-8">
      <h1 className="font-semibold text-2xl font-serif">Referrals</h1>
      <p className="-mt-4 text-neutral-500">
        Products and services I use and recommend. Use these links to get a
        discount (and I might get one too).
      </p>
      <div className="prose prose-neutral dark:prose-invert text-neutral-200 space-y-6">
        {referrals.map((referral) => (
          <div key={referral.name}>
            <p className="text-neutral-500 text-lg font-mono">
              {referral.name}
            </p>
            <p>{referral.description}</p>
            <ExternalLink href={referral.url}>Get started &rarr;</ExternalLink>
          </div>
        ))}
      </div>
      <div className="flex justify-start">
        <Link href="/" className="mr-2 p-2 -m-2">
          <ArrowLeft className="text-neutral-500" />
        </Link>
      </div>
    </section>
  );
}
