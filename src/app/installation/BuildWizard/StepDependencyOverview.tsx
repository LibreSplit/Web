import { ExternalLink, Package } from "lucide-solid";
import { For } from "solid-js";

import {
  DEPENDENCIES,
  OPTIONAL_DEPENDENCIES,
  type BuildDependency,
} from "@/app/installation/BuildWizard/dependencies";

interface DependencyListProps {
  dependencies: readonly BuildDependency[];
}

function DependencyList(props: DependencyListProps) {
  return (
    <ul
      class="m-0 grid gap-3 p-0 sm:grid-cols-2"
      style={{ "list-style": "none" }}
    >
      <For each={props.dependencies}>
        {(dependency) => (
          <li>
            <a
              href={dependency.url}
              target="_blank"
              rel="noreferrer"
              class="group flex h-full items-start gap-3 rounded-lg border bg-background p-4 transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <Package
                class="mt-0.5 size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
                aria-hidden="true"
              />
              <span class="min-w-0 flex-1">
                <span class="flex items-center gap-1.5 font-medium">
                  {dependency.name}
                  <ExternalLink
                    class="size-3.5 text-muted-foreground"
                    aria-hidden="true"
                  />
                </span>
                <span class="mt-2 block text-sm text-muted-foreground">
                  {dependency.purpose}
                </span>
              </span>
            </a>
          </li>
        )}
      </For>
    </ul>
  );
}

export function StepDependencyOverview() {
  return (
    <div class="space-y-8 p-1">
      <div>
        <h3 class="text-xl font-semibold">Review dependencies</h3>
      </div>
      <div class="space-y-4">
        <div>
          <h4 class="font-semibold">Required to build</h4>
          <p class="mt-1 text-sm text-muted-foreground">
            Install all of these before configuring the project
          </p>
        </div>
        <DependencyList dependencies={DEPENDENCIES} />
      </div>
      <div class="space-y-4">
        <div>
          <h4 class="font-semibold">Optional at runtime</h4>
          <p class="mt-1 text-sm text-muted-foreground">
            These enable split icons loaded from the web
          </p>
        </div>
        <DependencyList dependencies={OPTIONAL_DEPENDENCIES} />
      </div>
    </div>
  );
}
