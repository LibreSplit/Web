import { Card, CardContent } from "../ui/card";
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

export type AppMarkdownCodeBlockProps = {
  code: string;
  language?: string;
};

export function AppMarkdownCodeBlock(props: AppMarkdownCodeBlockProps) {
  const language = () => props.language ?? "text";
  const highlightedCode = createMemo(() => {
    const lang = language();
    const grammar = Prism.languages[lang] ?? Prism.languages.plaintext;
    return Prism.highlight(props.code, grammar, lang);
  });

  return (
    <div class="w-fit px-2">
      <Card class="w-fit">
        <CardContent class="w-fit">
          <pre>
            <code
              class={`language-${language()}`}
              innerHTML={highlightedCode()}
            />
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
