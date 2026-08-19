import { cn } from "@/lib/utils";
import { type ComponentProps, splitProps } from "solid-js";

type TableProps = ComponentProps<"table">;
type TableHeaderProps = ComponentProps<"thead">;
type TableBodyProps = ComponentProps<"tbody">;
type TableFooterProps = ComponentProps<"tfoot">;
type TableRowProps = ComponentProps<"tr">;
type TableHeadProps = ComponentProps<"th">;
type TableCellProps = ComponentProps<"td">;
type TableCaptionProps = ComponentProps<"caption">;

function Table(props: TableProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <div data-slot="table-container" class="relative w-full overflow-x-auto">
      <table
        data-slot="table"
        class={cn("w-full caption-bottom text-sm", local.class)}
        {...rest}
      />
    </div>
  );
}

function TableHeader(props: TableHeaderProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <thead
      data-slot="table-header"
      class={cn("[&_tr]:border-b", local.class)}
      {...rest}
    />
  );
}

function TableBody(props: TableBodyProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <tbody
      data-slot="table-body"
      class={cn("[&_tr:last-child]:border-0", local.class)}
      {...rest}
    />
  );
}

function TableFooter(props: TableFooterProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <tfoot
      data-slot="table-footer"
      class={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        local.class,
      )}
      {...rest}
    />
  );
}

function TableRow(props: TableRowProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <tr
      data-slot="table-row"
      class={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        local.class,
      )}
      {...rest}
    />
  );
}

function TableHead(props: TableHeadProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <th
      data-slot="table-head"
      class={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground has-[[role=checkbox]]:pr-0 *:[[role=checkbox]]:translate-y-0.5",
        local.class,
      )}
      {...rest}
    />
  );
}

function TableCell(props: TableCellProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <td
      data-slot="table-cell"
      class={cn(
        "p-2 align-middle whitespace-nowrap has-[[role=checkbox]]:pr-0 *:[[role=checkbox]]:translate-y-0.5",
        local.class,
      )}
      {...rest}
    />
  );
}

function TableCaption(props: TableCaptionProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return (
    <caption
      data-slot="table-caption"
      class={cn("mt-4 text-sm text-muted-foreground", local.class)}
      {...rest}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
