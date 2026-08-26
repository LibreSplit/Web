import { Package, PackageMinus, Wrench } from "lucide-solid";

import { BuildWizard } from "@/app/installation/BuildWizard";
import { UninstallInstructions } from "@/app/installation/BuildWizard/UninstallInstructions";
import { InstallationSection } from "@/app/installation/InstallationSection";

export function Installation() {
  return (
    <div>
      <section aria-labelledby="installation" class="my-12 text-foreground">
        <header class="relative overflow-hidden rounded-sm border bg-linear-to-br from-card via-card to-muted/60 p-6 shadow-sm sm:p-8">
          <div class="relative flex max-w-3xl items-start gap-4">
            <span class="flex size-12 shrink-0 items-center justify-center rounded-xl border bg-background shadow-sm">
              <Package class="size-6" aria-hidden="true" />
            </span>
            <div>
              <h2 id="installation" class="text-3xl font-bold tracking-tight">
                Install LibreSplit
              </h2>
              <p class="text-base leading-7 text-muted-foreground">
                Select your distro
              </p>
            </div>
          </div>
        </header>
        <section class="mt-6">
          <InstallationSection />
        </section>
      </section>
      <section aria-labelledby="build" class="my-12 text-foreground">
        <header class="relative overflow-hidden rounded-sm border bg-linear-to-br from-card via-card to-muted/60 p-6 shadow-sm sm:p-8">
          <div class="relative flex max-w-3xl items-start gap-4">
            <span class="flex size-12 shrink-0 items-center justify-center rounded-xl border bg-background shadow-sm">
              <Wrench class="size-6" aria-hidden="true" />
            </span>
            <div>
              <h2 id="build" class="text-3xl font-bold tracking-tight">
                Build From Source
              </h2>
              <p class="text-base leading-7 text-muted-foreground">
                Follow the build wizard to install all necessary dependencies
                and build LibreSplit yourself from source
              </p>
            </div>
          </div>
        </header>
        <section class="mt-6">
          <BuildWizard />
        </section>
      </section>
      <section aria-labelledby="uninstall" class="my-12 text-foreground">
        <header class="relative overflow-hidden rounded-sm border bg-linear-to-br from-card via-card to-muted/60 p-6 shadow-sm sm:p-8">
          <div class="relative flex items-center gap-4">
            <span class="flex size-12 shrink-0 items-center justify-center rounded-xl border bg-background shadow-sm">
              <PackageMinus class="size-6" aria-hidden="true" />
            </span>
            <div>
              <h2 id="build" class="text-3xl font-bold tracking-tight">
                Uninstall LibreSplit
              </h2>
            </div>
          </div>
        </header>
        <section class="mt-6">
          <UninstallInstructions />
        </section>
      </section>
    </div>
  );
}
