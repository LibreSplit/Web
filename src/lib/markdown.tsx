import { fromMarkdown } from "mdast-util-from-markdown";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { gfm } from "micromark-extension-gfm";
import { For, type JSX, createMemo } from "solid-js";
import { Dynamic } from "solid-js/web";

import { AppMarkdownCodeBlock } from "@/components/libresplit/AppMarkdownCodeBlock";
import { AppMarkdownTable } from "@/components/libresplit/AppMarkdownTable";

export function Markdown(props: { content: string }) {
  const tree = createMemo(() =>
    fromMarkdown(props.content, {
      extensions: [gfm()],
      mdastExtensions: [gfmFromMarkdown()],
    }),
  );

  function renderChildren(node: any): JSX.Element | null {
    if (!node.children) {
      return null;
    }
    return <For each={node.children}>{renderNode}</For>;
  }

  function renderNode(node: any): JSX.Element {
    switch (node.type) {
      case "text":
        return node.value;

      // Handles paragraph text.
      case "paragraph":
        return <p>{renderChildren(node)}</p>;

      // Handles bold or italic text.
      case "strong":
        return <p class="font-bold">{renderChildren(node)}</p>;
      case "emphasis":
        return <p class="italic">{renderChildren(node)}</p>;

      // Handles headings #, ## and ###.
      case "heading":
        switch (node.depth) {
          case 1:
            return (
              <div class="flex w-screen items-center justify-center">
                <h1 class="text-3xl font-extrabold">{renderChildren(node)}</h1>
              </div>
            );
          case 2:
            return <h2 class="text-2xl font-bold">{renderChildren(node)}</h2>;
          case 3:
            return (
              <h3 class="text-xl font-semibold">{renderChildren(node)}</h3>
            );
          default:
            return <div class="text-gray-700">{renderChildren(node)}</div>;
        }

      // Handle block quotes.
      case "blockquote":
        return (
          <blockquote class="border-l-4 border-gray-300 pl-4 text-gray-700 italic">
            {renderChildren(node)}
          </blockquote>
        );

      // Handles links in markdown [text](url).
      case "link":
        return (
          <a class="text-blue-300" href={node.url}>
            {renderChildren(node)}
          </a>
        );

      // Handles lists.
      case "list": {
        // Select between ol and ul. Apply tailwind styling.
        const listTag = node.ordered ? "ol" : "ul";
        const cls = node.ordered ? "list-decimal ml-6" : "list-disc ml-6";
        // Start only applys to ol(s).
        const startProps =
          node.ordered && node.start ? { start: node.start } : {};
        return (
          <Dynamic component={listTag} class={cls} {...startProps}>
            {renderChildren(node)}
          </Dynamic>
        );
      }
      case "listItem": {
        return <li>{renderChildren(node)}</li>;
      }

      // Handles tables.
      case "table":
        return <AppMarkdownTable node={node} renderChildren={renderChildren} />;

      // Handles code blocks.
      case "code":
        return <AppMarkdownCodeBlock code={node.value} language={node.lang} />;
      case "inlineCode":
        return <p>{node.value}</p>;

      // Handle html tags to catch images.
      case "html": {
        const imgs = [
          ...node.value.matchAll(
            /<img\s+[^>]*src=["']([^"']+)["'][^>]*?(?:alt=["']([^"']*)["'])?[^>]*>/gi,
          ),
        ];
        if (imgs.length) {
          return (
            <div class="my-4 flex flex-wrap justify-center gap-4">
              <For each={imgs}>
                {(match) => (
                  <img
                    src={match[1]}
                    alt={match[2] ?? ""}
                    class="h-auto max-w-full rounded-lg"
                  />
                )}
              </For>
            </div>
          );
        }
        return null;
      }

      // Handle thematic breaks.
      case "thematicBreak":
        return <hr class="my-4 border-gray-300" />;

      default:
        return renderChildren(node);
    }
  }

  return (
    <div class="space-y-6">
      <For each={tree().children}>{renderNode}</For>
    </div>
  );
}
