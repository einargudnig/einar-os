import Image from "next/image";
import desk from "../../public/images/desk.png";

export default function Page() {
  return (
    <div>
      <Image src={desk} alt="Desk" className="rounded-md" />
      <p className="mt-3 text-xs text-neutral-500">
        Point and shoot photo of the current setup
      </p>
    </div>
  );
}
