import { createFocusScope } from "@kobalte/core";
import { ArrowLeft } from "lucide-solid";
import { type JSX } from "solid-js";

import { InstallationInstructions } from "@/app/installation/InstallationInstructions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Distro } from "@/lib/utils";

export interface InstallationDetailsProps {
  active: boolean;
  distro: Distro;
  onBack: () => void;
  style: JSX.CSSProperties;
}

export function InstallationDetails(props: InstallationDetailsProps) {
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
        <CardHeader class="grid-cols-[auto_1fr] items-center gap-4 border-b px-6 pt-5 pb-2!">
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
