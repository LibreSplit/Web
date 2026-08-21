import { Dialog } from "@kobalte/core/dialog";
import { useLocation } from "@solidjs/router";
import { Menu, X } from "lucide-solid";
import {
  For,
  createEffect,
  createSignal,
  on,
  onCleanup,
  onMount,
} from "solid-js";

import { Button } from "../ui/button";
import { NavigationMenu, NavigationMenuLink } from "../ui/navigation-menu";
import { AppGitHubButton } from "./AppGitHubButton";
import { AppThemeToggleButton } from "./AppThemeToggleButton";

const logoUrl =
  "https://raw.githubusercontent.com/LibreSplit/LibreSplit/refs/heads/main/assets/libresplit.svg";

interface NavigationItem {
  label: string;
  href: string;
  includesSubpaths?: boolean;
}

const navigationItems: readonly NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "Docs", href: "/docs", includesSubpaths: true },
  { label: "Converter", href: "/converter" },
];

export function AppNav() {
  const location = useLocation();
  const isActive = (item: NavigationItem) =>
    item.includesSubpaths
      ? location.pathname === item.href ||
        location.pathname.startsWith(`${item.href}/`)
      : location.pathname === item.href;

  return (
    <header class="border-b bg-background">
      <div class="grid grid-cols-[1fr_auto] items-center px-2 py-1 md:grid-cols-[1fr_auto_1fr] md:gap-4 md:px-4 md:py-2">
        <MobileNavigation isActive={isActive} />
        <DesktopBrand />
        <DesktopNavigation isActive={isActive} />
        <div class="flex items-center justify-self-end">
          <RightNav />
        </div>
      </div>
    </header>
  );
}

interface NavigationProps {
  isActive: (item: NavigationItem) => boolean;
}

function MobileNavigation(props: NavigationProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = createSignal(false);
  let mobileNavigationRef: HTMLDivElement | undefined;

  createEffect(
    on(
      () => location.pathname,
      () => setIsOpen(false),
      { defer: true },
    ),
  );

  onMount(() => {
    const closeWhenHidden = () => {
      if (mobileNavigationRef?.getClientRects().length === 0) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", closeWhenHidden, { passive: true });
    onCleanup(() => window.removeEventListener("resize", closeWhenHidden));
  });

  return (
    <div
      ref={(element) => {
        mobileNavigationRef = element;
      }}
      class="flex items-center md:hidden"
    >
      <Dialog open={isOpen()} onOpenChange={setIsOpen}>
        <Dialog.Trigger
          as={Button}
          variant="ghost"
          size="icon"
          class="size-12"
          aria-label="Open navigation menu"
        >
          <Menu aria-hidden="true" />
        </Dialog.Trigger>

        <Dialog.Portal>
          <Dialog.Overlay class="fixed inset-0 z-50 bg-black/32 data-closed:animate-out data-closed:fade-out-0 data-expanded:animate-in data-expanded:fade-in-0 motion-reduce:animate-none" />
          <Dialog.Content class="fixed inset-y-0 left-0 z-50 flex h-dvh w-[min(22.5rem,85vw)] flex-col border-r bg-background shadow-xl data-closed:animate-out data-closed:slide-out-to-left data-expanded:animate-in data-expanded:slide-in-from-left motion-reduce:animate-none">
            <div class="flex min-h-16 items-center justify-between border-b px-4">
              <Dialog.Title class="flex items-center gap-2 text-lg font-semibold">
                <img src={logoUrl} alt="" class="w-8" />
                LibreSplit
              </Dialog.Title>
              <Dialog.CloseButton
                as={Button}
                variant="ghost"
                size="icon"
                class="size-12"
                aria-label="Close navigation menu"
              >
                <X aria-hidden="true" />
              </Dialog.CloseButton>
            </div>

            <nav aria-label="Primary" class="flex-1 overflow-y-auto p-4">
              <ul class="space-y-1">
                <For each={navigationItems}>
                  {(item) => (
                    <li>
                      <a
                        href={item.href}
                        aria-current={props.isActive(item) ? "page" : undefined}
                        data-active={props.isActive(item) ? "true" : undefined}
                        class="flex min-h-12 items-center rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </a>
                    </li>
                  )}
                </For>
              </ul>
            </nav>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

      <a
        href="/"
        class="rounded-md p-2 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
        aria-label="LibreSplit home"
      >
        <img src={logoUrl} alt="" class="w-8" />
      </a>
    </div>
  );
}

function DesktopBrand() {
  return (
    <a
      href="/"
      class="hidden w-fit items-center gap-2 rounded-md focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none md:flex"
    >
      <img src={logoUrl} alt="" class="w-8" />
      <span class="text-xl font-semibold">LibreSplit</span>
    </a>
  );
}

function DesktopNavigation(props: NavigationProps) {
  return (
    <nav aria-label="Primary" class="hidden md:block">
      <NavigationMenu>
        <For each={navigationItems}>
          {(item) => (
            <NavigationMenuLink
              href={item.href}
              aria-current={props.isActive(item) ? "page" : undefined}
              data-active={props.isActive(item) ? "true" : undefined}
            >
              {item.label}
            </NavigationMenuLink>
          )}
        </For>
      </NavigationMenu>
    </nav>
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
