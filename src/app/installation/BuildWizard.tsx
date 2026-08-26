import { ChevronLeft, ChevronRight, CircleCheck, Terminal } from "lucide-solid";
import { For, Show } from "solid-js";
import { createStore, produce } from "solid-js/store";

import { StepContent } from "@/app/installation/BuildWizard/StepContent";
import {
  BUILD_STEPS,
  type BuildStep,
} from "@/app/installation/BuildWizard/steps";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const StepDirection = {
  FORWARD: "forward",
  BACK: "back",
} as const;

export type StepDirection = (typeof StepDirection)[keyof typeof StepDirection];

interface Step {
  position: number;
  stepNum: number;
  content: BuildStep;
  showComplete: boolean;
  direction: StepDirection;
}

export function BuildWizard() {
  const [step, setStep] = createStore<Step>({
    position: 0,
    stepNum: 1,
    content: BUILD_STEPS[0],
    showComplete: false,
    direction: StepDirection.FORWARD,
  });

  const isFinished = () => step.position === BUILD_STEPS.length;

  const goBack = () =>
    setStep(
      produce((currentStep) => {
        if (currentStep.showComplete) {
          currentStep.showComplete = false;
          return;
        }

        currentStep.position =
          currentStep.position > 0 ? currentStep.position - 1 : 0;
        currentStep.stepNum = currentStep.position + 1;
        currentStep.content = BUILD_STEPS[currentStep.position];
        currentStep.showComplete = false;
        currentStep.direction = StepDirection.BACK;
      }),
    );

  const proceed = () =>
    setStep(
      produce((currentStep) => {
        const pos = currentStep.position + 1;
        currentStep.showComplete = pos >= BUILD_STEPS.length;
        currentStep.position =
          pos >= BUILD_STEPS.length ? BUILD_STEPS.length - 1 : pos;
        currentStep.stepNum = currentStep.position + 1;
        currentStep.content = BUILD_STEPS[currentStep.position];
        currentStep.direction = StepDirection.FORWARD;
      }),
    );

  return (
    <Card class="overflow-hidden py-0">
      <CardHeader class="border-b bg-muted/30 p-6">
        <h3 class="flex items-center gap-2 text-xl font-semibold">
          <Terminal class="size-6" aria-hidden="true" />
          Build Instructions
        </h3>
      </CardHeader>
      <CardContent class="space-y-6 p-6">
        <div class="space-y-3">
          <div class="flex items-center justify-between gap-4 text-sm">
            <p class="font-medium" aria-live="polite">
              <Show when={!isFinished()} fallback="Finished">
                Step {step.stepNum} of {BUILD_STEPS.length}
              </Show>
            </p>
            <Show when={step.content.title}>
              <p class="text-right text-muted-foreground">
                {step.content.title ?? ""}
              </p>
            </Show>
          </div>
          <div
            class="grid gap-2"
            style={{
              "grid-template-columns": `repeat(${BUILD_STEPS.length}, minmax(0, 1fr))`,
            }}
            role="progressbar"
            aria-label="Build progress"
            aria-valuemin="1"
            aria-valuemax={BUILD_STEPS.length}
            aria-valuenow={Math.min(step.stepNum, BUILD_STEPS.length)}
          >
            <For each={BUILD_STEPS}>
              {(_, index) => (
                <span
                  class="h-1.5 rounded-full transition-colors duration-300 motion-reduce:transition-none"
                  classList={{
                    "bg-primary": index() <= step.position,
                    "bg-muted": index() > step.position,
                  }}
                  aria-hidden="true"
                />
              )}
            </For>
          </div>
        </div>
        <div id="build-step-panel" aria-live="polite">
          <Show
            when={!step.showComplete}
            keyed
            fallback={
              <div class="flex min-h-60 animate-in items-center justify-center rounded-sm border bg-background p-6 fade-in-0 zoom-in-95 motion-reduce:animate-none">
                <div class="max-w-md text-center">
                  <CircleCheck class="mx-auto size-10" aria-hidden="true" />
                  <h3 class="mt-4 text-xl font-semibold">Finished</h3>
                  <p class="mt-2 text-sm">Start LibreSplit from your desktop</p>
                  <p class="mt-1 text-sm">
                    Or from your terminal:{" "}
                    <code class="rounded-md bg-muted px-[0.4em] py-[0.2em] font-mono text-[0.875em] font-normal">
                      /usr/local/bin/libresplit
                    </code>
                  </p>
                </div>
              </div>
            }
          >
            <div
              data-step={step.position}
              class="min-h-60 animate-in overflow-x-hidden overflow-y-auto overscroll-contain rounded-sm border bg-background p-5 duration-300 fade-in-0 motion-reduce:animate-none"
              classList={{
                "slide-in-from-right-4":
                  step.direction === StepDirection.FORWARD,
                "slide-in-from-left-4": step.direction === StepDirection.BACK,
              }}
            >
              <StepContent step={step.content} />
            </div>
          </Show>
        </div>
        <div class="flex items-center justify-between gap-3 border-t pt-6">
          <Button
            type="button"
            variant="outline"
            disabled={step.position === 0}
            aria-controls="build-step-panel"
            onClick={goBack}
          >
            <ChevronLeft aria-hidden="true" />
            Back
          </Button>
          <Button
            type="button"
            variant="outline"
            aria-controls="build-step-panel"
            disabled={step.showComplete}
            onClick={proceed}
          >
            Next
            <ChevronRight aria-hidden="true" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
