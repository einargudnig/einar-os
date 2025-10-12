import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import Link from "next/link";

export default function UsesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-2xl space-y-8 print:space-y-6 mb-8">
      <h1 className="font-bold text-2xl font-serif mb-5">Uses</h1>
      <div className="flex-col items-center justify-center">
        <UsesNav />
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

function UsesNav() {
  return (
    <div className="flex items-center justify-center">
      <ButtonGroup>
        <Button variant="outline">
          <Link href="../uses/desk">Desk</Link>
        </Button>
        <Button variant="outline">
          <Link href="../uses/devices">Devices</Link>
        </Button>
        <Button variant="outline">
          <Link href="../uses/keyboard">Keyboard</Link>
        </Button>
        <Button variant="outline">
          <Link href="../uses/command-line">Command line</Link>
        </Button>
        <Button variant="outline">
          <Link href="../uses/infrastructure">Infrastructure</Link>
        </Button>
      </ButtonGroup>
    </div>
  );
}
