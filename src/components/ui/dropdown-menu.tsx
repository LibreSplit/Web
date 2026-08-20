import { cn } from "@/lib/utils";
import { DropdownMenu as KDropdownMenu } from "@kobalte/core/dropdown-menu";
import { CheckIcon, ChevronRightIcon, CircleIcon } from "lucide-solid";
import {
  type ComponentProps,
  type ValidComponent,
  mergeProps,
  splitProps,
} from "solid-js";

interface ClassProps {
  class?: string;
}

function DropdownMenu(props: ComponentProps<typeof KDropdownMenu>) {
  return <KDropdownMenu {...props} />;
}

function DropdownMenuPortal(
  props: ComponentProps<typeof KDropdownMenu.Portal>,
) {
  return <KDropdownMenu.Portal {...props} />;
}

type DropdownMenuTriggerProps = ComponentProps<typeof KDropdownMenu.Trigger> & {
  as?: ValidComponent;
  variant?:
    "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg";
};

function DropdownMenuTrigger(props: DropdownMenuTriggerProps) {
  return <KDropdownMenu.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

type DropdownMenuContentProps = ComponentProps<typeof KDropdownMenu.Content> &
  ClassProps;

function DropdownMenuContent(props: DropdownMenuContentProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <KDropdownMenu.Portal>
      <KDropdownMenu.Content
        data-slot="dropdown-menu-content"
        class={cn(
          "z-50 max-h-(--kb-popper-content-available-height) min-w-32 origin-(--kb-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-expanded:animate-in data-expanded:fade-in-0 data-expanded:zoom-in-95 data-[placement^=bottom]:slide-in-from-top-2 data-[placement^=left]:slide-in-from-right-2 data-[placement^=right]:slide-in-from-left-2 data-[placement^=top]:slide-in-from-bottom-2",
          local.class,
        )}
        {...rest}
      />
    </KDropdownMenu.Portal>
  );
}

function DropdownMenuGroup(props: ComponentProps<typeof KDropdownMenu.Group>) {
  return <KDropdownMenu.Group data-slot="dropdown-menu-group" {...props} />;
}

type DropdownMenuItemProps = ComponentProps<typeof KDropdownMenu.Item> &
  ClassProps & {
    inset?: boolean;
    variant?: "default" | "destructive";
  };

function DropdownMenuItem(receivedProps: DropdownMenuItemProps) {
  const props = mergeProps({ variant: "default" as const }, receivedProps);
  const [local, rest] = splitProps(props, ["inset", "variant", "class"]);

  return (
    <KDropdownMenu.Item
      data-slot="dropdown-menu-item"
      data-inset={local.inset ? "" : undefined}
      data-variant={local.variant}
      class={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground data-inset:pl-8 data-[variant=destructive]:text-destructive data-[variant=destructive]:data-highlighted:bg-destructive/10 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive!",
        local.class,
      )}
      {...rest}
    />
  );
}

type DropdownMenuCheckboxItemProps = ComponentProps<
  typeof KDropdownMenu.CheckboxItem
> &
  ClassProps;

function DropdownMenuCheckboxItem(props: DropdownMenuCheckboxItemProps) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <KDropdownMenu.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      class={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        local.class,
      )}
      {...rest}
    >
      <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <KDropdownMenu.ItemIndicator>
          <CheckIcon class="size-4" />
        </KDropdownMenu.ItemIndicator>
      </span>
      {local.children}
    </KDropdownMenu.CheckboxItem>
  );
}

function DropdownMenuRadioGroup(
  props: ComponentProps<typeof KDropdownMenu.RadioGroup>,
) {
  return (
    <KDropdownMenu.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  );
}

type DropdownMenuRadioItemProps = ComponentProps<
  typeof KDropdownMenu.RadioItem
> &
  ClassProps;

function DropdownMenuRadioItem(props: DropdownMenuRadioItemProps) {
  const [local, rest] = splitProps(props, ["class", "children"]);
  return (
    <KDropdownMenu.RadioItem
      data-slot="dropdown-menu-radio-item"
      class={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        local.class,
      )}
      {...rest}
    >
      <span class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <KDropdownMenu.ItemIndicator>
          <CircleIcon class="size-2 fill-current" />
        </KDropdownMenu.ItemIndicator>
      </span>
      {local.children}
    </KDropdownMenu.RadioItem>
  );
}

type DropdownMenuLabelProps = ComponentProps<typeof KDropdownMenu.GroupLabel> &
  ClassProps & { inset?: boolean };

function DropdownMenuLabel(props: DropdownMenuLabelProps) {
  const [local, rest] = splitProps(props, ["inset", "class"]);
  return (
    <KDropdownMenu.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={local.inset ? "" : undefined}
      class={cn("px-2 py-1.5 text-sm font-medium data-inset:pl-8", local.class)}
      {...rest}
    />
  );
}

type DropdownMenuSeparatorProps = ComponentProps<
  typeof KDropdownMenu.Separator
> &
  ClassProps;

function DropdownMenuSeparator(props: DropdownMenuSeparatorProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KDropdownMenu.Separator
      data-slot="dropdown-menu-separator"
      class={cn("-mx-1 my-1 h-px bg-border", local.class)}
      {...rest}
    />
  );
}

type DropdownMenuShortcutProps = ComponentProps<"span"> & ClassProps;

function DropdownMenuShortcut(props: DropdownMenuShortcutProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      class={cn(
        "ml-auto text-xs tracking-widest text-muted-foreground",
        local.class,
      )}
      {...rest}
    />
  );
}

function DropdownMenuSub(props: ComponentProps<typeof KDropdownMenu.Sub>) {
  return <KDropdownMenu.Sub {...props} />;
}

type DropdownMenuSubTriggerProps = ComponentProps<
  typeof KDropdownMenu.SubTrigger
> &
  ClassProps & { inset?: boolean };

function DropdownMenuSubTrigger(props: DropdownMenuSubTriggerProps) {
  const [local, rest] = splitProps(props, ["inset", "class", "children"]);
  return (
    <KDropdownMenu.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={local.inset ? "" : undefined}
      class={cn(
        "flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-expanded:bg-accent data-expanded:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-inset:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
        local.class,
      )}
      {...rest}
    >
      {local.children}
      <ChevronRightIcon class="ml-auto size-4" />
    </KDropdownMenu.SubTrigger>
  );
}

type DropdownMenuSubContentProps = ComponentProps<
  typeof KDropdownMenu.SubContent
> &
  ClassProps;

function DropdownMenuSubContent(props: DropdownMenuSubContentProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <KDropdownMenu.SubContent
      data-slot="dropdown-menu-sub-content"
      class={cn(
        "z-50 min-w-32 origin-(--kb-menu-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-expanded:animate-in data-expanded:fade-in-0 data-expanded:zoom-in-95 data-[placement^=bottom]:slide-in-from-top-2 data-[placement^=left]:slide-in-from-right-2 data-[placement^=right]:slide-in-from-left-2 data-[placement^=top]:slide-in-from-bottom-2",
        local.class,
      )}
      {...rest}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
