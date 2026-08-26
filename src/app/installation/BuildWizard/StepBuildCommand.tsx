import type { BuildStep } from "@/app/installation/BuildWizard/steps";
import { CommandBlock } from "@/components/ui/CommandBlock";

export interface StepBuildCommandProps {
  step: BuildStep;
}

export function StepBuildCommand(props: StepBuildCommandProps) {
  return (
    <div class="p-1">
      <div class="mb-5 flex items-start gap-3">
        <div>
          <h3 class="text-xl font-semibold">{props.step.title}</h3>
          <p class="mt-1 text-sm text-muted-foreground">
            {props.step.description}
          </p>
        </div>
      </div>
      <CommandBlock command={props.step.command ?? ""} />
    </div>
  );
}
