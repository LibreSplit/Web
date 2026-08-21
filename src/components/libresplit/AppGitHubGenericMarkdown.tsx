import { Skeleton } from "@kobalte/core/skeleton";
import { useQuery } from "@tanstack/solid-query";
import { Match, mergeProps, Switch } from "solid-js";

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
  isHomePage?: boolean;
}

export function AppGitHubGenericMarkdown(
  receivedProps: AppGitHubGenericMarkdownProps,
) {
  const props = mergeProps({ isHomePage: false }, receivedProps);
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
              isHomePage={props.isHomePage}
            />
          </div>
        )}
      </Match>
    </Switch>
  );
}
