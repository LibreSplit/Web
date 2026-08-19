import { NavigationMenu, NavigationMenuLink } from "../ui/navigation-menu";
import { AppGitHubButton } from "./AppGitHubButton";
import { AppThemeToggleButton } from "./AppThemeToggleButton";

export function AppNav() {
  return (
    <nav class="flex w-full items-center justify-between border-b px-4 py-2">
      <div class="flex items-center">
        <LeftNav />
      </div>

      <div class="absolute left-1/2 -translate-x-1/2">
        <NavigationMenu>
          <NavigationMenuLink href="/">Home</NavigationMenuLink>
          <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
          <NavigationMenuLink href="/converter">Converter</NavigationMenuLink>
        </NavigationMenu>
      </div>

      <div class="flex items-center">
        <RightNav />
      </div>
    </nav>
  );
}

function LeftNav() {
  return (
    <a href="/">
      <div class="flex items-center gap-2">
        <img
          src="https://raw.githubusercontent.com/LibreSplit/LibreSplit/refs/heads/main/assets/libresplit.svg"
          alt="LibreSplit Logo"
          class="w-8"
        />
        <span class="text-xl font-semibold">LibreSplit</span>
      </div>
    </a>
  );
}

function RightNav() {
  return (
    <div class="flex items-center gap-2">
      <AppGitHubButton />
      <AppThemeToggleButton />
    </div>
  );
}
