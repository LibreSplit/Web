import type { UponSanitizeElementHookEvent } from "dompurify";
import type { Token, TokensList } from "marked";

import { AppGitHubGenericMarkdown } from "@/components/libresplit/AppGitHubGenericMarkdown";
import { AppHero } from "@/components/libresplit/AppHero";
import { resolveImageSrc } from "@/lib/markdown";

const APP_HOMEPAGE_README =
  "https://raw.githubusercontent.com/LibreSplit/LibreSplit/refs/heads/main/README.md";

const CUSTOM_SECTIONS = ["building", "installation", "uninstall libresplit"];

function removeCustomSections(
  tokens: Token[] | TokensList,
): Token[] | TokensList {
  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];

    if (
      token?.type !== "heading" ||
      token.depth !== 2 ||
      !CUSTOM_SECTIONS.includes(token.text.trim().toLowerCase())
    ) {
      i++;
      continue;
    }

    let next = i;
    while (next < tokens.length) {
      const nextToken = tokens[++next];
      if (nextToken?.type === "heading" && nextToken.depth <= token.depth) {
        break;
      }
    }

    tokens.splice(i, next - i);
  }

  return tokens;
}

export function Home() {
  const identifyBadges = (
    node: Element,
    event: UponSanitizeElementHookEvent,
  ) => {
    if (event.tagName !== "img") {
      return;
    }

    const src = node.getAttribute("src");
    const resolvedSrc = src && resolveImageSrc(src, APP_HOMEPAGE_README);
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
    node: Node,
    event: UponSanitizeElementHookEvent,
  ) => {
    if (!(node instanceof Element)) {
      return;
    }

    identifyBadges(node, event);

    // Remove the duplicate brand name header.
    if (event.tagName === "h1" && node.firstChild?.nodeValue === "LibreSplit") {
      node.remove();
    }

    // Remove the duplicate logo image.
    const src = event.tagName === "img" ? node.getAttribute("src") : null;
    if (src && src.toLowerCase().endsWith("libresplit.svg")) {
      node.remove();
    }
  };

  return (
    <div class="flex w-full min-w-0 flex-col items-center">
      <AppHero />
      <AppGitHubGenericMarkdown
        url={APP_HOMEPAGE_README}
        markedHooks={{ processAllTokens: removeCustomSections }}
        uponSanitizeElementHook={identifyCustomHomepageElements}
      />
    </div>
  );
}
