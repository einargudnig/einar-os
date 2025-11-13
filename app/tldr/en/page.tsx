import Image from "next/image";
import avatar from "../../../public/images/avatar.jpeg";
import Link from "next/link";

export default function EnPage() {
  return (
    <section className="mx-auto w-full max-w-2xl space-y-8 print:space-y-6 mb-8">
      <div className="flex items-center justify-between">
        <h1 className="font-semibold text-2xl font-serif">Hello!</h1>
        <Image
          src={avatar}
          alt="Einar Gudni"
          width={150}
          height={150}
          className="rounded-full grayscale"
        />
      </div>

      <p className="flex max-w-md text-md text-foreground ">
        I am Einar! I am a developer with a strong interest in the latest
        technology. I am experienced in building web solutions using React and
        TypeScript. I am solution-oriented and focus on providing a great user
        experience.
      </p>
      <p className="flex max-w-md text-md text-foreground ">
        I can help with developing web solutions, setting up systems, building
        new systems and maintanance.
      </p>
      <p className="flex max-w-md text-md text-foreground ">
        I have worked as developer since 2020, both for companies and as a
        freelance developer.
      </p>
      <p className="flex max-w-md text-md text-foreground ">
        You can see what I have been working on here on this site or contact me
        via email at einargudnig@gmail.com
      </p>
      <div className="flex justify-start">
        <Link href="/tldr/is" className="mr-2 p-2 -m-2">
          Þessi síða á Íslensku <span aria-hidden="true">🇮🇸</span>
        </Link>
      </div>
    </section>
  );
}
