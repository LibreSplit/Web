import { AppGitHubGenericMarkdown } from "@/components/libresplit/AppGitHubGenericMarkdown";
import { AppHero } from "@/components/libresplit/AppHero";

export function Home() {
  return (
    <div class="flex w-full min-w-0 flex-col items-center">
      <AppHero />
      <AppGitHubGenericMarkdown
        url="https://raw.githubusercontent.com/LibreSplit/LibreSplit/refs/heads/main/README.md"
        isHomePage={true}
      />
    </div>
  );
}
