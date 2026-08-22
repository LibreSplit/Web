import DOMPurify, {
  type UponSanitizeAttributeHook,
  type UponSanitizeElementHook,
  type UponSanitizeElementHookEvent,
} from "dompurify";
import { Marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";
import { markedHighlight } from "marked-highlight";
import Prism from "prismjs";

import "prism-themes/themes/prism-vsc-dark-plus.css";
import { createEffect, createMemo, onCleanup } from "solid-js";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-json";
import "prismjs/components/prism-lua";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-toml";
import "prismjs/components/prism-yaml";
import { render } from "solid-js/web";

import { AppInstallationInstructions } from "@/components/libresplit/AppInstallationInstructions";

interface MarkdownProps {
  content: string;
  sourceUrl: string;
  isHomePage: boolean;
}

const APP_INSTALLATION_ID = "app-installation-instructions";

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
  let installSection = false;
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

  const identifyBadges = (
    node: Element,
    event: UponSanitizeElementHookEvent,
  ) => {
    if (event.tagName !== "img") {
      return;
    }

    const src = node.getAttribute("src");
    const resolvedSrc = src && resolveImageSrc(src, sourceUrl);
    if (resolvedSrc && new URL(resolvedSrc).hostname === "img.shields.io") {
      node.classList.add("markdown-badge");

      if (node.parentElement?.tagName === "A") {
        node.parentElement.classList.add("markdown-badge-link");
      }
    } else if (node.closest('p[align="center"]')) {
      node.classList.add("max-md:w-full");
    }
  };

  const identifyCustomHomepageElements = (
    node: Element,
    event: UponSanitizeElementHookEvent,
  ) => {
    // Remove the duplicate brand name header.
    if (event.tagName === "h1" && node.firstChild?.nodeValue === "LibreSplit") {
      node.remove();
    }

    // Remove the duplicate logo image.
    const src = event.tagName === "img" ? node.getAttribute("src") : null;
    if (isHomePage && src && src.toLowerCase().endsWith("libresplit.svg")) {
      node.remove();
    }

    // Detect the readme's installation instructions section and replace it with a placeholder for our component
    if (event.tagName === "h2") {
      if (node.id === "installation") {
        installSection = true;
        return;
      } else if (installSection) {
        let prev = node.previousSibling;
        while (prev) {
          const next = prev.previousSibling;
          if (prev.nodeName.toLowerCase() !== "h2") {
            prev.remove();
          } else {
            const installation = prev.ownerDocument!.createElement("div");
            installation.dataset.solidSlot = APP_INSTALLATION_ID;
            prev.replaceWith(installation);
            prev = null;
            break;
          }

          prev = next;
        }
      }

      installSection = false;
    }

    if (installSection) {
      node.remove();
    }
  };

  const resolveElements: UponSanitizeElementHook = (node, event) => {
    if (!(node instanceof Element)) {
      return;
    }

    identifyBadges(node, event);

    // Home page customization handling
    if (isHomePage) {
      identifyCustomHomepageElements(node, event);
    }
  };

  DOMPurify.addHook("uponSanitizeAttribute", resolveImages);
  DOMPurify.addHook("uponSanitizeElement", resolveElements);

  try {
    return DOMPurify.sanitize(markdown.parse(content, { async: false }));
  } finally {
    DOMPurify.removeHook("uponSanitizeAttribute", resolveImages);
    DOMPurify.removeHook("uponSanitizeElement", resolveElements);
  }
}

export function Markdown(props: MarkdownProps) {
  let article!: HTMLElement;
  let disposeSlots: Array<() => void> = [];
  const content = createMemo(() =>
    renderMarkdown(props.content, props.sourceUrl, props.isHomePage),
  );

  createEffect(() => {
    for (const dispose of disposeSlots) dispose();

    disposeSlots = [];
    article.innerHTML = content();

    for (const slot of article.querySelectorAll<HTMLElement>(
      `[data-solid-slot="${APP_INSTALLATION_ID}"]`,
    )) {
      disposeSlots.push(render(() => <AppInstallationInstructions />, slot));
    }
  });

  onCleanup(() => {
    for (const dispose of disposeSlots) dispose();
  });

  return (
    <article
      ref={(element) => {
        article = element;
      }}
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
