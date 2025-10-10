"use client";

import { cn } from "@/lib/utils";
import { CheckIcon, ClipboardIcon } from "lucide-react";
import { useState } from "react";

interface CodeBlockProps {
  children: string;
  className?: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  children,
  className,
  language,
  filename,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-6 overflow-hidden rounded-lg border">
      {filename && (
        <div className="border-b bg-muted px-4 py-2 text-sm font-medium">
          {filename}
        </div>
      )}
      <div className="relative">
        <pre
          className={cn(
            "overflow-x-auto p-4 text-sm",
            showLineNumbers && "pl-12",
            className,
          )}
        >
          <code>{children}</code>
        </pre>
        {showLineNumbers && (
          <div className="absolute left-0 top-0 w-8 select-none border-r bg-muted/50 p-4 text-right text-xs text-muted-foreground">
            {children.split("\n").map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        )}
        {language && (
          <div className="absolute right-2 top-2 text-xs font-medium text-muted-foreground">
            {language.toUpperCase()}
          </div>
        )}
        <button
          onClick={copyToClipboard}
          className="absolute bottom-2 right-2 rounded bg-muted p-1 text-muted-foreground hover:bg-muted/80"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <CheckIcon className="h-4 w-4 text-green-500" />
          ) : (
            <ClipboardIcon className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
