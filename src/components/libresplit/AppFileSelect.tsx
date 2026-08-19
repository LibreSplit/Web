import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { FileField } from "@kobalte/core/file-field";
import { mergeProps } from "solid-js";

interface AppFileSelectProps {
  label?: string;
  value: File | File[] | null;
  onChange: (files: File | File[] | null) => void;
  multiple?: boolean;
  filters?: { name: string; extensions: string[] }[];
}

/**
 * Reasonable max number of files in a file picker
 */
const MAX_FILES = 100;

export default function AppFileSelect(receivedProps: AppFileSelectProps) {
  const props = mergeProps(
    { label: "Select file:", multiple: false },
    receivedProps,
  );

  const display = () => {
    if (!props.value) return "No file chosen.";
    if (Array.isArray(props.value)) {
      return props.value.map((file) => file.name).join(", ");
    }
    return props.value.name;
  };

  const handleChange = (files: File[]) => {
    if (props.multiple) {
      props.onChange(files);
    } else {
      props.onChange(files[0] ?? null);
    }
  };

  const accept = () =>
    props.filters
      ?.flatMap((filter) => filter.extensions.map((ext) => `.${ext}`))
      .join(",");

  return (
    <FileField
      class="space-y-2 px-8"
      multiple={props.multiple}
      maxFiles={props.multiple ? MAX_FILES : 1}
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
