import type { Component } from "solid-js";

import { StepDependencyInstructions } from "@/app/installation/BuildWizard/StepDependencyInstructions";
import { StepDependencyOverview } from "@/app/installation/BuildWizard/StepDependencyOverview";

export interface BuildStep {
  title: string;
  description?: string;
  command?: string | string[];
  content?: Component;
}

export const BUILD_STEPS = [
  { title: "Review dependencies", content: StepDependencyOverview },
  { title: "Install dependencies", content: StepDependencyInstructions },
  {
    title: "Download the source",
    description: "Download LibreSplit with git",
    command: [
      "git clone https://github.com/LibreSplit/LibreSplit",
      "cd LibreSplit",
    ],
  },
  {
    title: "Configure a release build",
    command: "meson setup build -Dbuildtype=release",
  },
  {
    title: "Compile",
    description: "Build LibreSplit from the configured source tree.",
    command: "meson compile -C build",
  },
  {
    title: "Install",
    description: "Install the compiled application on your system.",
    command: "meson install -C build",
  },
] as const satisfies readonly BuildStep[];
