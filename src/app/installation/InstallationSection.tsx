import { createTransition } from "@kobalte/core";
import { createSignal, For, Show } from "solid-js";

import { InstallationDetails } from "@/app/installation/InstallationDetails";
import { SUPPORTED_DISTROS, type Distro } from "@/lib/utils";

export function InstallationSection() {
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
      <div class="grid w-full min-w-0">
        <Show when={selectorTransition.keepMounted()}>
          <section
            alia-hidden={showInstructions()}
            inert={showInstructions()}
            class="col-start-1 row-start-1 min-w-0 origin-center will-change-[opacity,transform]"
            style={selectorTransition.style()}
          >
            <div class="grid grid-cols-1 gap-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <For each={SUPPORTED_DISTROS}>
                {(distro) => (
                  <button
                    type="button"
                    class="group grid min-h-64 cursor-pointer grid-rows-[6rem_auto_1fr] items-center justify-center gap-6 rounded-sm border bg-card p-6 text-center text-card-foreground shadow-sm transition-[border-color,box-shadow,translate,background-color] duration-200 hover:-translate-y-1 hover:border-primary/40 hover:bg-accent/30 hover:shadow-lg focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none active:translate-y-0 motion-reduce:transform-none motion-reduce:transition-none"
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
                    <span class="text-xs text-muted-foreground">
                      <Show when={"desc" in distro && distro.desc} keyed>
                        {(desc) => desc}
                      </Show>
                    </span>
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
