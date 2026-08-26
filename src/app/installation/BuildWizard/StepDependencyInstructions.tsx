import { Tabs } from "@kobalte/core/tabs";
import { ExternalLink, Search } from "lucide-solid";
import { For, Show } from "solid-js";

import { DISTRO_DEPENDENCIES } from "@/app/installation/BuildWizard/dependencies";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { CommandBlock } from "@/components/ui/CommandBlock";

interface PackageLinksProps {
  label: string;
  packages: readonly string[];
  packageUrl: (packageName: string) => string;
}

function PackageLinks(props: PackageLinksProps) {
  return (
    <div class="space-y-2">
      <p class="text-xs font-medium text-muted-foreground">{props.label}</p>
      <ul class="m-0 flex flex-wrap gap-2 p-0" style={{ "list-style": "none" }}>
        <For each={props.packages}>
          {(packageName) => (
            <li>
              <a
                href={props.packageUrl(packageName)}
                target="_blank"
                rel="noreferrer"
                class="inline-flex items-center gap-1 rounded-full border bg-muted/40 px-2.5 py-1 font-mono text-xs transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                {packageName}
                <ExternalLink class="size-3" aria-hidden="true" />
              </a>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}

export function StepDependencyInstructions() {
  return (
    <div class="space-y-4 p-1">
      <div>
        <h3 class="text-xl font-semibold">Install dependencies</h3>
      </div>
      <Tabs>
        <Tabs.List
          class="grid gap-1 rounded-sm bg-muted p-1 sm:grid-cols-2 lg:grid-cols-5"
          aria-label="Linux distribution"
        >
          <For each={DISTRO_DEPENDENCIES}>
            {(distro) => (
              <Tabs.Trigger
                value={distro.id}
                class="cursor-pointer rounded-sm px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 data-selected:bg-background data-selected:text-foreground data-selected:shadow-sm"
              >
                {distro.name}
              </Tabs.Trigger>
            )}
          </For>
          <Tabs.Trigger
            value="other"
            class="cursor-pointer rounded-sm px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 data-selected:bg-background data-selected:text-foreground data-selected:shadow-sm"
          >
            Other
          </Tabs.Trigger>
        </Tabs.List>
        <For each={DISTRO_DEPENDENCIES}>
          {(distro) => (
            <Tabs.Content
              value={distro.id}
              class="mt-4 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <Card>
                <CardHeader>
                  <div class="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <h4 class="font-semibold">{distro.family}</h4>
                      <Show when={"instructions" in distro}>
                        <CardDescription class="mt-2">
                          {"instructions" in distro ? distro.instructions : ""}
                        </CardDescription>
                      </Show>
                    </div>
                    <a
                      href={distro.packageIndexUrl}
                      target="_blank"
                      rel="noreferrer"
                      class="inline-flex shrink-0 items-center gap-1.5 self-start rounded-md text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      Browse packages
                      <ExternalLink class="size-4" aria-hidden="true" />
                    </a>
                  </div>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="space-y-3">
                    <PackageLinks
                      label="Required packages"
                      packages={distro.requiredPackages}
                      packageUrl={distro.packageUrl}
                    />
                    <CommandBlock command={distro.requiredCommand} />
                  </div>
                  <div class="space-y-3">
                    <PackageLinks
                      label="Optional runtime packages"
                      packages={distro.optionalPackages}
                      packageUrl={distro.packageUrl}
                    />
                    <CommandBlock command={distro.optionalCommand} />
                  </div>
                </CardContent>
              </Card>
            </Tabs.Content>
          )}
        </For>
        <Tabs.Content
          value="other"
          class="mt-4 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <Card>
            <CardHeader>
              <h4 class="font-semibold">Other Linux Distribution</h4>
              <CardDescription>
                For all other distros, find the packages from the previous
                dependencies step for your specific distro and install them
                following your specific distro's guidance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="flex flex-col gap-4 rounded-xl border border-dashed bg-muted/30 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div class="flex items-start gap-3">
                  <Search
                    class="mt-0.5 size-5 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <div>
                    <p class="font-medium">Find equivalent packages</p>
                    <p class="mt-1 text-sm text-muted-foreground">
                      Search for each dependency then confirm the development
                      packages in your distribution's official repository
                    </p>
                  </div>
                </div>
                <a
                  href="https://repology.org/projects/"
                  target="_blank"
                  rel="noreferrer"
                  class="inline-flex shrink-0 items-center gap-2 self-start rounded-md border bg-background px-3 py-2 text-sm font-medium shadow-xs transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  Search Repology
                  <ExternalLink class="size-4" aria-hidden="true" />
                </a>
              </div>
            </CardContent>
          </Card>
        </Tabs.Content>
      </Tabs>
    </div>
  );
}
