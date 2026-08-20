import { FileField } from "@kobalte/core/file-field";
import { mergeProps } from "solid-js";

import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface AppFileSelectProps {
  label?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  filters?: { name: string; extensions: string[] }[];
}

export default function AppFileSelect(receivedProps: AppFileSelectProps) {
  const props = mergeProps({ label: "Select file:" }, receivedProps);

  const display = () => {
    if (!props.value) return "No file chosen.";
    return props.value.name;
  };

  const handleChange = (files: File[]) => {
    props.onChange(files[0] ?? null);
  };

  const accept = () =>
    props.filters
      ?.flatMap((filter) => filter.extensions.map((ext) => `.${ext}`))
      .join(",");

  return (
    <FileField
      class="space-y-2 px-8"
      multiple={false}
      accept={accept()}
      onFileChange={({ acceptedFiles }) => handleChange(acceptedFiles)}
    >
      <FileField.Label>{props.label}</FileField.Label>
      <div class="flex items-center">
        <Input class="flex-1 rounded-r-none" value={display()} readonly />
        <FileField.Trigger
          as={Button}
          type="button"
          class="rounded-l-none bg-gray-200 text-black hover:bg-blue-200"
        >
          Open
        </FileField.Trigger>
      </div>
      <FileField.HiddenInput />
    </FileField>
  );
}
