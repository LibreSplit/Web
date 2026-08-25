import DOMPurify, {
  type UponSanitizeAttributeHook,
  type UponSanitizeAttributeHookEvent,
  type UponSanitizeElementHook,
  type UponSanitizeElementHookEvent,
} from "dompurify";
import { Marked, type HooksObject } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";
import { markedHighlight } from "marked-highlight";
import Prism from "prismjs";

import "prism-themes/themes/prism-vsc-dark-plus.css";
import { createMemo } from "solid-js";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-json";
import "prismjs/components/prism-lua";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-toml";
import "prismjs/components/prism-yaml";

interface MarkdownProps {
  content: string;
  sourceUrl: string;
  markedHooks?: HooksObject<string, string>;
  uponSanitizeAttributeHook?: (
    element: Element,
    attribute: UponSanitizeAttributeHookEvent,
  ) => void;
  uponSanitizeElementHook?: (
    node: Node,
    event: UponSanitizeElementHookEvent,
  ) => void;
}

export function resolveImageSrc(value: string, sourceUrl: string) {
  try {
    const url = new URL(value, sourceUrl);
    const [owner, repository, blob, reference, ...path] = url.pathname
      .split("/")
      .filter(Boolean);

    if (
      url.hostname === "github.com" &&
      owner &&
      repository &&
      blob === "blob" &&
      reference &&
      path.length
    ) {
      return new URL(
        `https://raw.githubusercontent.com/${owner}/${repository}/${reference}/${path.join("/")}`,
      ).href;
    }

    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {}

  return null;
}

export function resolveImageSrcset(value: string, sourceUrl: string) {
  return value
    .split(",")
    .map((candidate) => {
      const [url, ...descriptor] = candidate.trim().split(/\s+/);
      const resolvedUrl = resolveImageSrc(url, sourceUrl);

      return resolvedUrl ? [resolvedUrl, ...descriptor].join(" ") : null;
    })
    .filter((candidate) => !!candidate)
    .join(", ");
}

function renderMarkdown(markdown: Marked, props: MarkdownProps) {
  const resolveImages = (
    element: Element,
    attribute: UponSanitizeAttributeHookEvent,
  ) => {
    if (element.tagName !== "IMG" && element.tagName !== "SOURCE") {
      return;
    }

    const resolvedValue =
      attribute.attrName === "src"
        ? resolveImageSrc(attribute.attrValue, props.sourceUrl)
        : attribute.attrName === "srcset"
          ? resolveImageSrcset(attribute.attrValue, props.sourceUrl)
          : undefined;

    if (resolvedValue === null || resolvedValue === undefined) {
      return;
    }

    if (resolvedValue) {
      attribute.attrValue = resolvedValue;
    } else {
      attribute.keepAttr = false;
    }
  };

  const resolveAttributes: UponSanitizeAttributeHook = (element, attribute) => {
    resolveImages(element, attribute);

    // Custom page handling
    if (props.uponSanitizeAttributeHook !== undefined) {
      props.uponSanitizeAttributeHook(element, attribute);
    }
  };

  const resolveElements: UponSanitizeElementHook = (node, event) => {
    // Custom page handling
    if (props.uponSanitizeElementHook !== undefined) {
      props.uponSanitizeElementHook(node, event);
    }
  };

  DOMPurify.addHook("uponSanitizeAttribute", resolveAttributes);
  DOMPurify.addHook("uponSanitizeElement", resolveElements);

  try {
    return DOMPurify.sanitize(markdown.parse(props.content, { async: false }));
  } finally {
    DOMPurify.removeHook("uponSanitizeAttribute", resolveAttributes);
    DOMPurify.removeHook("uponSanitizeElement", resolveElements);
  }
}

export function Markdown(props: MarkdownProps) {
  const markdown = createMemo(
    () =>
      new Marked(
        { gfm: true, breaks: false },
        gfmHeadingId(),
        markedHighlight({
          highlight(code, language) {
            const lang = Prism.languages.hasOwnProperty(language)
              ? language
              : "plaintext";

            const grammar = Prism.languages[lang];
            return Prism.highlight(code, grammar, lang);
          },
        }),
        {
          hooks: props.markedHooks,
        },
      ),
  );

  const content = createMemo(() => renderMarkdown(markdown(), props));

  // oxlint-disable solid/no-innerhtml -- content is sanitizied by DOMPurify
  return (
    <article
      innerHTML={content()}
      class="markdown prose w-full max-w-none min-w-0 prose-neutral dark:prose-invert"
      on:error={{
        capture: true,
        handleEvent: (event) => {
          if (event.target instanceof HTMLImageElement) {
            event.target.alt = "";
            event.target.hidden = true;
          }
        },
      }}
    />
  );
}
