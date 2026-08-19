import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { For } from "solid-js";

const docs = [
  {
    title: "Auto Splitters",
    description:
      "Documentation and tips for creating auto splitters for LibreSplit.",
    to: "/docs/auto-splitters.md",
  },
  {
    title: "Settings and Keybinds",
    description: "Customize controls and behavior.",
    to: "/docs/settings-keybinds.md",
  },
  {
    title: "Split Files",
    description: "JSON split file documentation.",
    to: "/docs/split-files.md",
  },
  {
    title: "Themes",
    description: "Style the app to your liking.",
    to: "/docs/themes.md",
  },
  {
    title: "Troubleshooting",
    description: "Fix common issues and edge cases.",
    to: "/docs/troubleshooting.md",
  },
];

export function Docs() {
  return (
    <div class="mx-auto max-w-5xl px-6 py-12">
      <h1 class="mb-8 text-3xl font-bold">Documentation</h1>

      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <For each={docs}>
          {(doc) => (
            <a href={doc.to}>
              <Card class="h-full transition hover:border-primary hover:shadow-lg">
                <CardHeader>
                  <CardTitle>{doc.title}</CardTitle>
                  <CardDescription>{doc.description}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          )}
        </For>
      </div>
    </div>
  );
}
