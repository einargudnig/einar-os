import { createFileRoute } from "@tanstack/react-router";
import { UsesItem, UsesList } from "@/components/uses-item";

function KeyboardPage() {
  return (
    <UsesList>
      <UsesItem
        name="Keychron Q8 Pro"
        href="https://www.keychron.com/products/keychron-q8-pro-qmk-via-wireless-custom-mechanical-keyboard"
        description="Alice layout, wireless"
      />
      <UsesItem
        name="NuPhy Halo75"
        href="https://nuphy.com/collections/halo75"
        description="75% wireless"
      />
    </UsesList>
  );
}

export const Route = createFileRoute("/uses/keyboard/")({
  component: KeyboardPage,
});
