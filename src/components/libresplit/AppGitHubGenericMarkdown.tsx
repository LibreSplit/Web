import { Markdown } from "@/lib/markdown";
import { Skeleton } from "@kobalte/core/skeleton";
import { useQuery } from "@tanstack/solid-query";
import { Match, Switch } from "solid-js";

async function fetchMarkdown(url: string): Promise<string> {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch markdown from GitHub.");
  }

  return res.text();
}

type AppGitHubGenericMarkdownProps = {
  url: string;
};

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
          <div>
            <Markdown content={data()} sourceUrl={props.url} />
          </div>
        )}
      </Match>
    </Switch>
  );
}
