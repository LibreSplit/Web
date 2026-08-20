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

interface MarkdownProps {
  content: string;
  sourceUrl: string;
  isHomePage: boolean;
}

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

function renderMarkdown(
  content: string,
  sourceUrl: string,
  isHomePage: boolean,
) {
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

    if (resolvedValue === null || resolvedValue === undefined) {
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
      if (
        isHomePage &&
        event.tagName === "h1" &&
        node instanceof Element &&
        node.firstChild?.nodeValue === "LibreSplit"
      ) {
        // For the home page, remove the duplicate brand name header.
        node.remove();
      }

      return;
    }

    // For the home page, remove the duplicate logo image.
    const src = node.getAttribute("src");
    if (isHomePage && src && src.toLowerCase().endsWith("libresplit.svg")) {
      node.remove();
      return;
    }

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

export function Markdown(props: MarkdownProps) {
  const content = createMemo(() =>
    renderMarkdown(props.content, props.sourceUrl, props.isHomePage),
  );

  // oxlint-disable solid/no-innerhtml -- content is sanitized before passing to innerHTML
  return (
    <article
      class="prose max-w-none prose-neutral dark:prose-invert"
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
