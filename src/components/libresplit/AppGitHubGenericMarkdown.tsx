import { Skeleton } from "@kobalte/core/skeleton";
import { useQuery } from "@tanstack/solid-query";
import type {
  UponSanitizeAttributeHookEvent,
  UponSanitizeElementHookEvent,
} from "dompurify";
import type { HooksObject } from "marked";
import { Match, Switch } from "solid-js";

import { Markdown } from "@/lib/markdown";

async function fetchMarkdown(url: string): Promise<string> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch markdown from GitHub.");
  }

  return res.text();
}

interface AppGitHubGenericMarkdownProps {
  url: string;
  markedHooks?: HooksObject<string, string>;
  uponSanitizeAttributeHook?: (
    element: Element,
    attribute: UponSanitizeAttributeHookEvent,
  ) => void;
  uponSanitizeElementHook?: (
    node: Node,
    event: UponSanitizeElementHookEvent,
  ) => void;
}

export function AppGitHubGenericMarkdown(props: AppGitHubGenericMarkdownProps) {
  const query = useQuery(() => ({
    queryKey: [props.url],
    queryFn: () => fetchMarkdown(props.url),
    enabled: !!props.url,
  }));

  return (
    <Switch>
      <Match when={query.isLoading}>
        <Skeleton class="min-h-40 animate-pulse rounded-md bg-accent" />
      </Match>
      <Match when={query.error || !query.data}>
        <div>Failed to fetch markdown from GitHub.</div>
      </Match>
      <Match when={query.data}>
        {(data) => (
          <div class="w-full min-w-0">
            <Markdown
              content={data()}
              sourceUrl={props.url}
              markedHooks={props.markedHooks}
              uponSanitizeAttributeHook={props.uponSanitizeAttributeHook}
              uponSanitizeElementHook={props.uponSanitizeElementHook}
            />
          </div>
        )}
      </Match>
    </Switch>
  );
}
