import { cn } from "@/lib/utils";

interface AppSplitPreviewProps {
  text: string;
  class?: string;
}

export function AppSplitPreview(props: AppSplitPreviewProps) {
  return (
    <textarea
      readOnly
      value={props.text}
      wrap="off"
      spellcheck={false}
      aria-readonly="true"
      class={cn(
        "min-h-0 w-full min-w-0 flex-1 resize-none rounded-lg border bg-card p-3 font-mono text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        props.class,
      )}
    />
  );
}
