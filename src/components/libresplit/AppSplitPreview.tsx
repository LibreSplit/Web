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
      class={`h-full w-full resize-none ${props.class ?? ""}`}
    />
  );
}
