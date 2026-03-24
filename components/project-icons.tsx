import type { ReactNode } from "react";

const cls = "size-5 shrink-0";

function JstopIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={cls}>
      <rect x="3" y="10" width="3" height="8" rx="0.75" fill="currentColor" opacity="0.3" className="pi-el pi-bar pi-bar-1" />
      <rect x="8.5" y="4" width="3" height="14" rx="0.75" fill="currentColor" opacity="0.3" className="pi-el pi-bar pi-bar-2" />
      <rect x="14" y="7" width="3" height="11" rx="0.75" fill="currentColor" opacity="0.3" className="pi-el pi-bar pi-bar-3" />
    </svg>
  );
}

function TsMiniIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={cls}>
      <polyline points="7,4 3,10 7,16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" opacity="0.3" className="pi-el pi-bracket pi-bracket-l" />
      <line x1="9.5" y1="4" x2="10.5" y2="16" strokeWidth="1.5" strokeLinecap="round" stroke="currentColor" opacity="0.3" className="pi-el pi-bracket pi-slash" />
      <polyline points="13,4 17,10 13,16" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" opacity="0.3" className="pi-el pi-bracket pi-bracket-r" />
    </svg>
  );
}

function DotfilesIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={cls}>
      <circle cx="4.5" cy="10" r="2" fill="currentColor" opacity="0.3" className="pi-el pi-dot pi-dot-1" />
      <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.3" className="pi-el pi-dot pi-dot-2" />
      <circle cx="15.5" cy="10" r="2" fill="currentColor" opacity="0.3" className="pi-el pi-dot pi-dot-3" />
    </svg>
  );
}

function EinarOsIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={cls}>
      <rect x="1" y="2" width="18" height="16" rx="2" strokeWidth="1.5" stroke="currentColor" opacity="0.25" className="pi-el pi-frame" />
      <circle cx="4.5" cy="5" r="1" fill="currentColor" opacity="0.15" className="pi-el pi-win-dot pi-win-dot-1" />
      <circle cx="7.5" cy="5" r="1" fill="currentColor" opacity="0.15" className="pi-el pi-win-dot pi-win-dot-2" />
      <circle cx="10.5" cy="5" r="1" fill="currentColor" opacity="0.15" className="pi-el pi-win-dot pi-win-dot-3" />
      <line x1="1" y1="8" x2="19" y2="8" strokeWidth="1" stroke="currentColor" opacity="0.12" className="pi-el" />
      <rect x="4" y="10.5" width="9" height="1.5" rx="0.5" fill="currentColor" opacity="0" className="pi-el pi-content pi-content-1" />
      <rect x="4" y="14" width="6" height="1.5" rx="0.5" fill="currentColor" opacity="0" className="pi-el pi-content pi-content-2" />
    </svg>
  );
}

function TodoSystemIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={cls}>
      <circle cx="4.5" cy="5" r="2" strokeWidth="1.5" stroke="currentColor" fill="none" opacity="0.3" className="pi-el pi-todo pi-todo-1" />
      <circle cx="4.5" cy="10" r="2" strokeWidth="1.5" stroke="currentColor" fill="none" opacity="0.3" className="pi-el pi-todo pi-todo-2" />
      <circle cx="4.5" cy="15" r="2" strokeWidth="1.5" stroke="currentColor" fill="none" opacity="0.3" className="pi-el pi-todo pi-todo-3" />
      <rect x="9" y="4" width="8" height="2" rx="0.5" fill="currentColor" opacity="0.18" className="pi-el" />
      <rect x="9" y="9" width="6" height="2" rx="0.5" fill="currentColor" opacity="0.18" className="pi-el" />
      <rect x="9" y="14" width="7" height="2" rx="0.5" fill="currentColor" opacity="0.18" className="pi-el" />
    </svg>
  );
}

function BabyIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={cls}>
      <path
        d="M10 16.5C10 16.5 3 12.5 3 7.5C3 5 5 3 7 3C8.2 3 9.2 3.6 10 4.5C10.8 3.6 11.8 3 13 3C15 3 17 5 17 7.5C17 12.5 10 16.5 10 16.5Z"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
        fill="none"
        opacity="0.3"
        className="pi-el pi-heart"
      />
    </svg>
  );
}

export const projectIcons: Record<string, () => ReactNode> = {
  jstop: JstopIcon,
  "ts-mini": TsMiniIcon,
  dotfiles: DotfilesIcon,
  "einar-os": EinarOsIcon,
  "todo-system": TodoSystemIcon,
  baby: BabyIcon,
};
