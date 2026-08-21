import { Skeleton } from "@kobalte/core/skeleton";
import { Show, createResource } from "solid-js";

import { GithubButton } from "../ui/github-button";

// Fetch repo data from GitHub API.
const fetchStars = async () => {
  const response = await fetch(
    "https://api.github.com/repos/LibreSplit/LibreSplit",
    {
      headers: { Accept: "application/vnd.github+json" },
    },
  );

  if (!response.ok) {
    throw new Error(`Github API error: ${response.status}`);
  }

  const data = (await response.json()) as { stargazers_count: number };
  return data.stargazers_count;
};

export function AppGitHubButton() {
  const [stars] = createResource<number>(fetchStars);

  return (
    <Show
      when={!stars.loading}
      fallback={
        <Skeleton class="min-h-12 min-w-20 animate-pulse rounded-md bg-accent md:min-h-8 md:min-w-32" />
      }
    >
      <GithubButton
        repoUrl="https://github.com/LibreSplit/LibreSplit"
        label="GitHub"
        labelClass="hidden md:inline"
        stars={stars}
        class="h-12 gap-1.5 px-2.5 md:h-8.5 md:gap-2 md:px-3"
      />
    </Show>
  );
}
