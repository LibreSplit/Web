import { Show } from "solid-js";
import { Dynamic } from "solid-js/web";

import { StepBuildCommand } from "@/app/installation/BuildWizard/StepBuildCommand";
import type { BuildStep } from "@/app/installation/BuildWizard/steps";

export interface StepContentProps {
  step: BuildStep;
}

export function StepContent(props: StepContentProps) {
  return (
    <Show
      when={props.step.content !== undefined}
      fallback={<StepBuildCommand step={props.step} />}
    >
      <Dynamic component={props.step.content} />
    </Show>
  );
}
