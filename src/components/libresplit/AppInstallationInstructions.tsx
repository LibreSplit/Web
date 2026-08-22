import { createFocusScope, createTransition } from "@kobalte/core";
import { ArrowLeft, Download } from "lucide-solid";
import { createSignal, For, Match, Show, Switch, type JSX } from "solid-js";

import archLogo from "@/assets/distros/arch-linux.svg";
import fedoraLogo from "@/assets/distros/fedora.svg";
import linuxLogo from "@/assets/distros/linux.svg";
import nixLogo from "@/assets/distros/nixos.svg";
import { GitHubIcon } from "@/assets/icons/GitHubIcon";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DistroType = {
  ARCH: "arch-linux",
  FEDORA: "fedora",
  NIX: "nixos",
  OTHER: "other",
} as const;

type DistroType = (typeof DistroType)[keyof typeof DistroType];

interface Distro {
  type: DistroType;
  label: string;
  logo: string;
  desc?: string;
}

const SUPPORTED_DISTROS = [
  { type: DistroType.FEDORA, label: "Fedora", logo: fedoraLogo, desc: "" },
  { type: DistroType.ARCH, label: "Arch Linux", logo: archLogo },
  { type: DistroType.NIX, label: "NixOS", logo: nixLogo },
  { type: DistroType.OTHER, label: "Other", logo: linuxLogo },
] as const satisfies readonly Distro[];

function InstallationInstructions(props: { distro: DistroType }) {
  return (
    <Switch>
      <Match when={props.distro === DistroType.FEDORA}>
        <p>Download the RPM:</p>
        <div class="flex flex-wrap gap-2">
          <a
            class={buttonVariants({ variant: "outline", size: "sm" })}
            href="https://rpm.libresplit.org/libresplit.x86_64.rpm"
          >
            <Download />
            x86_64 (AMD/Intel)
          </a>
          <a
            class={buttonVariants({ variant: "outline", size: "sm" })}
            href="https://rpm.libresplit.org/libresplit.aarch64.rpm"
          >
            <Download />
            ARM64
          </a>
        </div>
        <p>Or install via CLI:</p>
        <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100 shadow-inner">
          <code>{`sudo dnf install "https://rpm.libresplit.org/libresplit.$(uname -m).rpm`}</code>
        </pre>
        <p>
          Official RPM packages are signed with the{" "}
          <a
            class="text-primary underline underline-offset-4 hover:text-primary/80"
            href="https://rpm.libresplit.org/RPM-GPG-KEY-libresplit"
            target="_blank"
          >
            LibreSplit RPM signing key
          </a>
        </p>
        <p>You can verify the package using the following fingerprint:</p>
        <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100 shadow-inner">
          <code>{`AE81 2B2C ED7C D507 FCD1  B39E 10C0 57F4 106B 63CB`}</code>
        </pre>
      </Match>
      <Match when={props.distro === DistroType.ARCH}>
        <p>
          LibreSplit is available on the Arch User Repository (AUR). You can
          install it with your AUR manager of choice:
        </p>
        <pre class="overflow-x-auto rounded-lg bg-zinc-950 p-4 text-sm text-zinc-100 shadow-inner">
          <code>
            {`# using yay
yay libresplit-git

# using paru
yay libresplit-git`}
          </code>
        </pre>
        <p>
          See the{" "}
          <a
            class="text-primary underline underline-offset-4 hover:text-primary/80"
            href="https://aur.archlinux.org/packages/libresplit-git"
            target="_blank"
          >
            package on the AUR.
          </a>
        </p>
      </Match>
      <Match when={props.distro === DistroType.NIX}>
        <p>
          See the{" "}
          <a
            class="text-primary underline underline-offset-4 hover:text-primary/80"
            href="https://search.nixos.org/packages?channel=25.05&show=libresplit&query=libresplit"
            target="_blank"
          >
            libresplit
          </a>{" "}
          package, courtesy of{" "}
          <a
            class="text-primary underline underline-offset-4 hover:text-primary/80"
            href="https://github.com/fgaz"
            target="_blank"
          >
            @fgaz
          </a>
          .
        </p>
      </Match>
      <Match when={props.distro === DistroType.OTHER}>
        <p>
          LibreSplit also packages an AppImage which is available for download
          on github from the releases section.
        </p>
        <a
          class={buttonVariants({ variant: "outline", size: "sm" })}
          href="https://github.com/LibreSplit/LibreSplit/releases/latest"
          target="_blank"
        >
          <GitHubIcon />
          Latest Release
        </a>
        <p>
          If an AppImage is not suitable then you may also download the packaged
          source from the release above and follow the build instructions below
          to build LibreSplit for your system.
        </p>
      </Match>
    </Switch>
  );
}

interface InstallationDetailsProps {
  active: boolean;
  distro: Distro;
  onBack: () => void;
  style: JSX.CSSProperties;
}

function InstallationDetails(props: InstallationDetailsProps) {
  let panel: HTMLElement | undefined;

  createFocusScope(
    {
      trapFocus: false,
      // for keyboard accessibility, refocus the previously selected distro
      onUnmountAutoFocus(event) {
        event.preventDefault();
        const owner = (event.currentTarget as HTMLElement).ownerDocument;
        owner
          .getElementById(`installation-trigger-${props.distro.type}`)
          ?.focus({ preventScroll: true });
      },
    },
    () => (props.active ? panel : undefined),
  );

  return (
    <section
      ref={(element) => {
        panel = element;
      }}
      aria-hidden={!props.active}
      inert={!props.active}
      class="col-start-1 row-start-1 min-w-0 origin-center will-change-[opacity,transform]"
      style={props.style}
    >
      <Button
        type="button"
        class="mb-4 -ml-3 cursor-pointer"
        size="sm"
        variant="ghost"
        onClick={props.onBack}
      >
        <ArrowLeft aria-hidden="true" />
        Back to distros
      </Button>

      <Card
        aria-labelledby={`installation-${props.distro.type}`}
        class="min-h-64 min-w-0 gap-0 overflow-hidden py-0"
      >
        <CardHeader class="grid-cols-[auto_1fr] items-center gap-4 border-b px-6 py-5">
          <img
            alt={props.distro.label}
            class="w-10 object-contain"
            src={props.distro.logo}
          />
          <CardTitle>
            <h3 id={`installation-${props.distro.type}`} class="text-xl">
              {props.distro.label}
            </h3>
          </CardTitle>
        </CardHeader>
        <CardContent class="flex-1 space-y-5 px-6 py-6 text-sm leading-6 sm:text-base">
          <InstallationInstructions distro={props.distro.type} />
        </CardContent>
      </Card>
    </section>
  );
}

export function AppInstallationInstructions() {
  const [selectedDistro, setSelectedDistro] = createSignal<Distro | null>(null);
  const [showInstructions, setShowInstructions] = createSignal(false);

  const transition = {
    transition: {
      in: { opacity: 1, transform: "translateX(0) scale(1)" },
      out: { opacity: 0, transform: "translateX(-1.5rem) scale(0.98)" },
    },
    duration: 300,
    delay: 75,
    exitDelay: 0,
    easing: "ease-out",
  };

  const instructionsTransition = createTransition(showInstructions, transition);
  const selectorTransition = createTransition(
    () => !showInstructions(),
    transition,
  );

  return (
    <section alia-labelledby="installation">
      <h2 id="installation">Installation</h2>
      <div class="not-prose grid w-full min-w-0">
        <Show when={selectorTransition.keepMounted()}>
          <section
            alia-hidden={showInstructions()}
            inert={showInstructions()}
            class="col-start-1 row-start-1 min-w-0 origin-center will-change-[opacity,transform]"
            style={selectorTransition.style()}
          >
            <p class="mb-6 text-muted-foreground">Select your distro</p>
            <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <For each={SUPPORTED_DISTROS}>
                {(distro) => (
                  <button
                    type="button"
                    class="group flex min-h-64 cursor-pointer flex-col items-center justify-center gap-6 rounded-xl border bg-card p-6 text-center text-card-foreground shadow-sm transition-[border-color,box-shadow,translate,background-color] duration-200 hover:-translate-y-1 hover:border-primary/40 hover:bg-accent/30 hover:shadow-lg focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none active:translate-y-0 motion-reduce:transform-none motion-reduce:transition-none"
                    onClick={() => {
                      setSelectedDistro(distro);
                      setShowInstructions(true);
                    }}
                  >
                    <span class="flex h-24 items-center justify-center">
                      <img
                        alt={distro.label}
                        class="max-h-20 w-24 object-contain transition-transform duration-200 group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                        src={distro.logo}
                      />
                    </span>
                    <span class="text-xl font-semibold">{distro.label}</span>
                    <Show when={"desc" in distro && distro.desc} keyed>
                      {(desc) => (
                        <span class="text-xl font-semibold">{desc}</span>
                      )}
                    </Show>
                  </button>
                )}
              </For>
            </div>
          </section>
        </Show>
        <Show when={instructionsTransition.keepMounted()}>
          <Show when={selectedDistro()} keyed>
            {(distro) => (
              <InstallationDetails
                active={showInstructions()}
                distro={distro}
                style={instructionsTransition.style()}
                onBack={() => setShowInstructions(false)}
              />
            )}
          </Show>
        </Show>
      </div>
    </section>
  );
}
