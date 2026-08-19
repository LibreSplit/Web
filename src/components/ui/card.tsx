import { cn } from "@/lib/utils";
import { type ComponentProps, splitProps } from "solid-js";

type CardPartProps = ComponentProps<"div">;

function Card(props: CardPartProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="card"
      class={cn(
        "flex flex-col gap-6 rounded-xl border bg-card py-6 text-card-foreground shadow-sm",
        local.class,
      )}
      {...rest}
    />
  );
}

function CardHeader(props: CardPartProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="card-header"
      class={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        local.class,
      )}
      {...rest}
    />
  );
}

function CardTitle(props: CardPartProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="card-title"
      class={cn("leading-none font-semibold", local.class)}
      {...rest}
    />
  );
}

function CardDescription(props: CardPartProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="card-description"
      class={cn("text-sm text-muted-foreground", local.class)}
      {...rest}
    />
  );
}

function CardAction(props: CardPartProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="card-action"
      class={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        local.class,
      )}
      {...rest}
    />
  );
}

function CardContent(props: CardPartProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div data-slot="card-content" class={cn("px-6", local.class)} {...rest} />
  );
}

function CardFooter(props: CardPartProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div
      data-slot="card-footer"
      class={cn("flex items-center px-6 [.border-t]:pt-6", local.class)}
      {...rest}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
export type { CardPartProps };
