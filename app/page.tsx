import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GlobeIcon } from "lucide-react";
import Link from "next/link";

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
    <section className="mx-auto w-full max-w-2xl spacy-y-8">
      <div className="flex items-center justify-between">
        <div className="flex-1 space-y-1.5">
          <h1 className="md:text-3xl font-bold">Einar Gudni</h1>
          <p className="flex max-w-md text-md text-foreground ">
            <span className="italics font-bold">Curious</span>, Tinkerer, Late
            bloomer & Nerd
          </p>
          <p className="max-w-md items-center text-pretty font-mono text-xs text-muted-foreground">
            <a
              className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
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
          <div className="group">
            <Link href="/about" className="group-hover:underline text-lg">
              About
            </Link>
            <p className="text-muted-foreground group-hover:underline">
              Who, What, Why
            </p>
          </div>
          <div className="group">
            <Link href="/now" className="group-hover:underline text-lg">
              Now
            </Link>
            <p className="text-muted-foreground group-hover:underline">
              Short-term focus
            </p>
          </div>
          <div className="group">
            <Link href="/someday" className="group-hover:underline text-lg">
              Someday
            </Link>
            <p className="text-muted-foreground group-hover:underline">
              Long-term focus
            </p>
          </div>
        </div>
      </Section>

      <Section className="mt-4">
        <div className="flex items-baseline">
          <h2 className="text-xl font-bold">Newest Writing</h2>
          <p className="ml-2">
            -&gt;{" "}
            <Link href="/blog" className="hover:underline">
              all writing
            </Link>
          </p>
        </div>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <p className="font-semibold text-lg">keyboard</p>
              <p className="font-mono text-sm text-muted-foreground">
                08 june 2025
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              I like writing on a good keyboard! This is a post about my daily
              driver that I have at home! I have made some updates and even
              though I say it myself it looks and feels great! Check out the
              updates, the photos and the image
            </p>
          </CardContent>
          <CardFooter>
            <div className="flex justify-end">
              <Link href="/blog/keyboard">
                <Button variant="outline">Read post</Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      </Section>

      <Section className="mt-4">
        <h2 className="text-xl font-bold">Work Experience</h2>
        {work.map((work) => {
          return (
            <Card key={work.company}>
              <CardHeader>
                <div className="flex items-center justify-between gap-x-2 text-base">
                  <h3 className="inline-flex items-center justify-center gap-x-1 font-semibold leading-none">
                    <a className="hover:underline" href={work.link}>
                      {work.company}
                    </a>

                    <span className="inline-flex gap-x-1">
                      {work.badges.map((badge) => (
                        <Badge
                          variant="secondary"
                          className="align-middle text-xs"
                          key={badge}
                        >
                          {badge}
                        </Badge>
                      ))}
                    </span>
                  </h3>
                  <div className="text-sm tabular-nums text-muted-foreground">
                    {work.start} - {work.end}
                  </div>
                </div>

                <h4 className="font-mono text-sm leading-none">{work.title}</h4>
              </CardHeader>
              <CardFooter>
                <div className="mt-2 flex flex-wrap gap-1">
                  {work.stack.map((tag) => (
                    <Badge key={tag} variant="outline" className="mr-1">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </Section>
    </section>
  );
}
