import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { For, type JSX, Show } from "solid-js";

type Align = "left" | "center" | "right" | null;

type MarkdownTableCell = {
  type: "tableCell";
  children?: any[];
};

type MarkdownTableRow = {
  type: "tableRow";
  children: MarkdownTableCell[];
};

type MarkdownTable = {
  type: "table";
  align?: Align[];
  children: MarkdownTableRow[];
};

type AppMarkdownTableProps = {
  node: MarkdownTable;
  renderChildren: (n: any) => JSX.Element | null;
  caption?: JSX.Element;
  class?: string;
};

export function AppMarkdownTable(props: AppMarkdownTableProps) {
  const headerRow = () => props.node.children[0];
  const bodyRows = () => props.node.children.slice(1);

  const alignClass = (idx: number) => {
    const a = props.node.align?.[idx];
    if (a === "center") return "text-center";
    if (a === "right") return "text-right";
    return "text-left";
  };

  return (
    <Table class={props.class ?? "my-4"}>
      <Show when={props.caption}>
        {(caption) => <TableCaption>{caption()}</TableCaption>}
      </Show>

      <Show when={headerRow()}>
        {(header) => (
          <TableHeader>
            <TableRow>
              <For each={header().children}>
                {(cell, index) => (
                  <TableHead class={alignClass(index())}>
                    {props.renderChildren(cell)}
                  </TableHead>
                )}
              </For>
            </TableRow>
          </TableHeader>
        )}
      </Show>

      <TableBody>
        <For each={bodyRows()}>
          {(row) => (
            <TableRow>
              <For each={row.children}>
                {(cell, index) => (
                  <TableCell class={alignClass(index())}>
                    {props.renderChildren(cell)}
                  </TableCell>
                )}
              </For>
            </TableRow>
          )}
        </For>
      </TableBody>
    </Table>
  );
}
