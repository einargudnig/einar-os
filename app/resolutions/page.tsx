import { Checkbox } from "@/components/ui/checkbox";

export default function ResolutionsPage() {
  return (
    <section className="mx-auto w-full max-w-2xl space-y-8 print:space-y-6 mb-8">
      <h1 className="font-semibold text-2xl font-serif">Resolutions</h1>

      <div className="prose prose-neutral dark:prose-invert text-neutral-200">
        <p className="text-neutral-500 text-lg font-mono">2026</p>
        <ul className="mt-4">
          <li className="flex items-center gap-2">
            <Checkbox disabled />
            <p className="">Become a dad!</p>
          </li>
          <li className="flex items-center gap-2">
            <Checkbox disabled />
            <p className="">sub 75 minute pro single HYROX </p>
          </li>
          <li className="flex items-center gap-2">
            <Checkbox disabled />
            <p className="">Create a native app</p>
          </li>
          <li className="flex items-center gap-2">
            <Checkbox disabled />
            <p className="">Publish an app (app store, play store)</p>
          </li>
          <li className="flex items-center gap-2">
            <Checkbox disabled />
            <p className="">Create a web simple web service in two hono</p>
          </li>
          <li className="flex items-center gap-2">
            <Checkbox disabled />
            <p className="">Re-write the simple web service in effect</p>
          </li>
          <li className="flex items-center gap-2">
            <Checkbox disabled />
            <p className="">Finish Total TypeScript Pro courses</p>
          </li>
          <li className="flex items-center gap-2">
            <Checkbox disabled />
            <p className="">Finish the uses page</p>
          </li>
        </ul>
      </div>
    </section>
  );
}
