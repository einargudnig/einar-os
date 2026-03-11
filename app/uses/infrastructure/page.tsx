import { UsesItem, UsesList } from "@/components/uses-item";

export default function InfraPage() {
  return (
    <UsesList>
      <UsesItem name="Ghostty" href="https://ghostty.org" description="GPU-accelerated terminal" />
      <UsesItem name="WezTerm" href="https://wezfurlong.org/wezterm/" description="Terminal emulator" />
      <UsesItem name="Zsh" href="https://www.zsh.org" description="Shell" />
      <UsesItem name="Raycast" href="https://raycast.com" description="Launcher and productivity tool" />
      <UsesItem name="Obsidian" href="https://obsidian.md" description="Knowledge base and notes" />
      <UsesItem name="Things 3" href="https://culturedcode.com/things/" description="Task manager" />
      <UsesItem name="Spark" href="https://sparkmailapp.com" description="Email client" />
      <UsesItem name="Arc" href="https://arc.net" description="Browser" />
      <UsesItem name="Notion Calendar" href="https://www.notion.so/product/calendar" description="Calendar" />
      <UsesItem name="Cursor" href="https://cursor.com" description="AI code editor" />
      <UsesItem name="Bruno" href="https://www.usebruno.com" description="API client" />
      <UsesItem name="Insomnia" href="https://insomnia.rest" description="API client" />
      <UsesItem name="1Password" href="https://1password.com" description="Password manager" />
      <UsesItem name="CleanShot X" href="https://cleanshot.com" description="Screenshot tool" />
      <UsesItem name="Rectangle Pro" href="https://rectangleapp.com/pro" description="Window management" />
      <UsesItem name="Homerow" href="https://www.homerow.app" description="Keyboard navigation for macOS" />
      <UsesItem name="Vimium" href="https://vimium.github.io" description="Vim keybindings for the browser" />
      <UsesItem name="Karabiner-Elements" href="https://karabiner-elements.pqrs.org" description="Keyboard customizer" />
      <UsesItem name="Cold Turkey" href="https://getcoldturkey.com" description="Website blocker" />
      <UsesItem name="Toggl" href="https://toggl.com" description="Time tracking" />
    </UsesList>
  );
}
