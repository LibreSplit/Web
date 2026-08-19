import { cn } from "@/lib/utils";
import { NavigationMenu as KNavigationMenu } from "@kobalte/core/navigation-menu";
import { cva } from "class-variance-authority";
import { ChevronDownIcon } from "lucide-solid";
import {
  type ComponentProps,
  type ParentProps,
  Show,
  type ValidComponent,
  children,
  mergeProps,
  splitProps,
} from "solid-js";

type ClassProps = { class?: string };

type NavigationMenuProps = ComponentProps<typeof KNavigationMenu> &
  ClassProps & { viewport?: boolean };

function NavigationMenu(receivedProps: NavigationMenuProps) {
  const props = mergeProps(
    { viewport: true, skipDelayDuration: 0 },
    receivedProps,
  );
  const [local, rest] = splitProps(props, ["viewport", "class", "children"]);

  return (
    <KNavigationMenu
      data-slot="navigation-menu"
      data-viewport={local.viewport ? "true" : "false"}
      class={cn(
        "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center gap-1",
        local.class,
      )}
      {...rest}
    >
      {local.children}
      <Show when={local.viewport}>
        <NavigationMenuViewport />
      </Show>
    </KNavigationMenu>
  );
}

type NavigationMenuListProps = ComponentProps<"div"> & ClassProps;

function NavigationMenuList(props: NavigationMenuListProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      role="presentation"
      data-slot="navigation-menu-list"
      class={cn(
        "group flex flex-1 list-none items-center justify-center gap-1",
        local.class,
      )}
      {...rest}
    />
  );
}

type NavigationMenuItemProps = ParentProps<ClassProps>;

function NavigationMenuItem(props: NavigationMenuItemProps) {
  return (
    <div
      role="presentation"
      data-slot="navigation-menu-item"
      class={cn("relative", props.class)}
    >
      <KNavigationMenu.Menu>{props.children}</KNavigationMenu.Menu>
    </div>
  );
}

const navigationMenuTriggerStyle = cva(
  "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 data-[expanded]:hover:bg-accent data-[expanded]:text-accent-foreground data-[expanded]:focus:bg-accent data-[expanded]:bg-accent/50 focus-visible:ring-ring/50 outline-none transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1",
);

type NavigationMenuTriggerProps = ComponentProps<
  typeof KNavigationMenu.Trigger
> &
  ClassProps;

function NavigationMenuTrigger(props: NavigationMenuTriggerProps) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <KNavigationMenu.Trigger
      data-slot="navigation-menu-trigger"
      class={cn(navigationMenuTriggerStyle(), "group", local.class)}
      {...rest}
    >
      {local.children}{" "}
      <ChevronDownIcon
        class="relative top-px ml-1 size-3 transition duration-300 group-data-expanded:rotate-180"
        aria-hidden="true"
      />
    </KNavigationMenu.Trigger>
  );
}

type NavigationMenuContentProps = ComponentProps<
  typeof KNavigationMenu.Content
> &
  ClassProps;

function NavigationMenuContent(props: NavigationMenuContentProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KNavigationMenu.Portal>
      <KNavigationMenu.Content
        data-slot="navigation-menu-content"
        class={cn(
          "top-0 left-0 w-full p-2 pr-2.5 data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out md:absolute md:w-auto",
          "group-data-[viewport=false]/navigation-menu:top-full group-data-[viewport=false]/navigation-menu:mt-1.5 group-data-[viewport=false]/navigation-menu:overflow-hidden group-data-[viewport=false]/navigation-menu:rounded-md group-data-[viewport=false]/navigation-menu:border group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:duration-200 group-data-[viewport=false]/navigation-menu:data-closed:animate-out group-data-[viewport=false]/navigation-menu:data-closed:fade-out-0 group-data-[viewport=false]/navigation-menu:data-closed:zoom-out-95 group-data-[viewport=false]/navigation-menu:data-expanded:animate-in group-data-[viewport=false]/navigation-menu:data-expanded:fade-in-0 group-data-[viewport=false]/navigation-menu:data-expanded:zoom-in-95 **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none",
          local.class,
        )}
        {...rest}
      />
    </KNavigationMenu.Portal>
  );
}

type NavigationMenuViewportProps = ComponentProps<
  typeof KNavigationMenu.Viewport
> &
  ClassProps;

function NavigationMenuViewport(props: NavigationMenuViewportProps = {}) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div class="absolute top-full left-0 isolate z-50 flex justify-center">
      <KNavigationMenu.Viewport
        data-slot="navigation-menu-viewport"
        class={cn(
          "origin-top-center relative mt-1.5 h-(--kb-navigation-menu-viewport-height) w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-closed:animate-out data-closed:zoom-out-95 data-expanded:animate-in data-expanded:zoom-in-90 md:w-(--kb-navigation-menu-viewport-width)",
          local.class,
        )}
        {...rest}
      />
    </div>
  );
}

type NavigationMenuLinkProps = ComponentProps<"a"> &
  ClassProps & {
    as?: ValidComponent;
  };

function NavigationMenuLink(receivedProps: NavigationMenuLinkProps) {
  const props = mergeProps({ as: "a" as ValidComponent }, receivedProps);
  const [local, rest] = splitProps(props, ["as", "class"]);
  return (
    <KNavigationMenu.Trigger
      as={local.as}
      data-slot="navigation-menu-link"
      class={cn(
        "data-active=true:data-[highlighted]:bg-accent flex flex-col gap-1 rounded-sm p-2 text-sm transition-all outline-none hover:bg-accent hover:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground data-[active=true]:hover:bg-accent [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        local.class,
      )}
      {...rest}
    />
  );
}

type NavigationMenuIndicatorProps = ComponentProps<"div"> & ClassProps;

function NavigationMenuIndicator(props: NavigationMenuIndicatorProps) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  const resolvedChildren = children(() => local.children);

  return (
    <div
      data-slot="navigation-menu-indicator"
      class={cn(
        "top-full z-1 flex h-1.5 items-end justify-center overflow-hidden",
        local.class,
      )}
      {...rest}
    >
      <Show
        when={resolvedChildren() != null}
        fallback={
          <div class="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
        }
      >
        {resolvedChildren()}
      </Show>
    </div>
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
};
