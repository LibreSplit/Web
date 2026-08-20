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
        <Skeleton class="min-h-8 min-w-32 animate-pulse rounded-md bg-accent" />
      }
    >
      <GithubButton
        repoUrl="https://github.com/LibreSplit/LibreSplit"
        label="GitHub"
        stars={stars}
      />
    </Show>
  );
}
