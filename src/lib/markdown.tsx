import DOMPurify from "dompurify";
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
export function Markdown(props: { content: string }) {
  const content = createMemo(() =>
    DOMPurify.sanitize(markdown.parse(props.content, { async: false })),
  );

  return (
    <article
      class="prose max-w-none prose-neutral dark:prose-invert [&_table]:block [&_table]:overflow-x-auto"
      innerHTML={content()}
    />
  );
}
