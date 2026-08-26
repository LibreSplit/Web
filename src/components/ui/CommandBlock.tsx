import bash from "@shikijs/langs/bash";
import darkPlus from "@shikijs/themes/dark-plus";
import { Check, Copy } from "lucide-solid";
import { createJavaScriptRegexEngine } from "shiki";
import { createHighlighterCoreSync } from "shiki/core";
import { createMemo, Show } from "solid-js";
import { createSignal, onCleanup } from "solid-js";

import { Button } from "@/components/ui/button";

const shiki = createHighlighterCoreSync({
  themes: [darkPlus],
  langs: [bash],
  engine: createJavaScriptRegexEngine(),
});

export interface CommandBlockProps {
  /** The command to highlight - THIS IS NOT SANITIZED, DO NOT PASS USER CONTENT */
  command: string | string[];
}

export function CommandBlock(props: CommandBlockProps) {
  const [copied, setCopied] = createSignal(false);
  let copiedTimeout: ReturnType<typeof setTimeout> | undefined;

  const command = createMemo(() =>
    shiki.codeToHtml(
      Array.isArray(props.command) ? props.command.join("\n") : props.command,
      {
        lang: "bash",
        theme: darkPlus,
        structure: "inline",
      },
    ),
  );

  const copyCommand = async () => {
    try {
      await navigator.clipboard.writeText(
        Array.isArray(props.command) ? props.command.join("\n") : props.command,
      );
    } catch {
      return;
    }

    setCopied(true);
    clearTimeout(copiedTimeout);
    copiedTimeout = setTimeout(() => setCopied(false), 2000);
  };

  onCleanup(() => clearTimeout(copiedTimeout));

  // oxlint-disable solid/no-innerhtml -- content should be hardcoded safe strings
  return (
    <div class="relative overflow-hidden rounded-lg border bg-zinc-950 text-zinc-100 shadow-sm">
      <div class="absolute top-2.5 right-2 z-10">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          class="text-zinc-400 hover:bg-white/10 hover:text-white"
          aria-label={copied() ? "Command copied" : "Copy command"}
          onClick={copyCommand}
        >
          <Show when={copied()} fallback={<Copy aria-hidden="true" />}>
            <Check aria-hidden="true" />
          </Show>
        </Button>
        <span class="sr-only" aria-live="polite">
          {copied() ? "Command copied" : ""}
        </span>
      </div>
      <pre class="language-bash overflow-x-auto bg-zinc-950! p-4 pr-14 text-sm leading-6 whitespace-pre-wrap">
        <code innerHTML={command()} />
      </pre>
    </div>
  );
}
