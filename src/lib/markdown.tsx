import DOMPurify, {
  type UponSanitizeAttributeHook,
  type UponSanitizeElementHook,
} from "dompurify";
import { Marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";
import { markedHighlight } from "marked-highlight";

import "prism-themes/themes/prism-vsc-dark-plus.css";
import Prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-json";
import "prismjs/components/prism-lua";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-toml";
import "prismjs/components/prism-yaml";
import { createMemo } from "solid-js";

const markdown = new Marked(
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
);

function resolveImageSrc(value: string, sourceUrl: string) {
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

function resolveImageSrcset(value: string, sourceUrl: string) {
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

function renderMarkdown(content: string, sourceUrl: string) {
  const resolveImages: UponSanitizeAttributeHook = (element, attribute) => {
    if (element.tagName !== "IMG" && element.tagName !== "SOURCE") {
      return;
    }

    const resolvedValue =
      attribute.attrName === "src"
        ? resolveImageSrc(attribute.attrValue, sourceUrl)
        : attribute.attrName === "srcset"
          ? resolveImageSrcset(attribute.attrValue, sourceUrl)
          : undefined;

    if (!resolvedValue) {
      return;
    }

    if (resolvedValue) {
      attribute.attrValue = resolvedValue;
    } else {
      attribute.keepAttr = false;
    }
  };

  const identifyBadges: UponSanitizeElementHook = (node, event) => {
    if (event.tagName !== "img" || !(node instanceof Element)) {
      return;
    }

    const src = node.getAttribute("src");
    const resolvedSrc = src && resolveImageSrc(src, sourceUrl);
    if (resolvedSrc && new URL(resolvedSrc).hostname === "img.shields.io") {
      node.classList.add("markdown-badge");

      if (node.parentElement?.tagName === "A") {
        node.parentElement.classList.add("markdown-badge-link");
      }
    }
  };

  DOMPurify.addHook("uponSanitizeAttribute", resolveImages);
  DOMPurify.addHook("uponSanitizeElement", identifyBadges);

  try {
    return DOMPurify.sanitize(markdown.parse(content, { async: false }));
  } finally {
    DOMPurify.removeHook("uponSanitizeAttribute", resolveImages);
    DOMPurify.removeHook("uponSanitizeElement", identifyBadges);
  }
}

export function Markdown(props: { content: string; sourceUrl: string }) {
  const content = createMemo(() =>
    renderMarkdown(props.content, props.sourceUrl),
  );

  return (
    <article
      class="prose prose-neutral dark:prose-invert max-w-none [&_.markdown-badge]:mx-2 [&_.markdown-badge]:my-0 [&_.markdown-badge]:inline-block [&_.markdown-badge]:rounded-lg [&_.markdown-badge]:align-middle [&_.markdown-badge-link]:no-underline [&_table]:block [&_table]:overflow-x-auto"
      innerHTML={content()}
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
