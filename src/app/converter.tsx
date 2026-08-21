import init, { convert } from "@libresplit/converter";
import wasmUrl from "@libresplit/converter/converter_bg.wasm?url";
import { Show, createSignal } from "solid-js";

import AppFileSelect from "@/components/libresplit/AppFileSelect";
import { AppSplitPreview } from "@/components/libresplit/AppSplitPreview";
import { Button } from "@/components/ui/button";

export function Converter() {
  const [selectedFile, setSelectedFile] = createSignal<File | null>(null);
  const [fileText, setFileText] = createSignal<string | null>(null);
  const [result, setResult] = createSignal<string | null>(null);

  const handleSelectChange = async (file: File | null) => {
    setSelectedFile(file);
    setResult(null);
    setFileText(null);

    if (file) {
      const text = await file.text();
      setFileText(text);
    }
  };

  const handleSubmit = async () => {
    const file = selectedFile();
    if (!file) {
      alert("Please select a file before submitting!");
      return;
    }

    try {
      const text = await file.text();
      await init({ module_or_path: wasmUrl });
      const converted = convert(text);
      setResult(converted);
    } catch (error) {
      console.error("Error processing file: ", error);
      alert("Failed to process file. See console for details.");
    }
  };

  const handleDownload = () => {
    const converted = result();
    const file = selectedFile();
    if (!converted || !file) return;

    const fileName = file.name.replace(/\.[^/.]+$/, ".json");
    const blob = new Blob([converted], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div class="flex w-full flex-col gap-4 md:min-h-0 md:flex-1 md:overflow-hidden">
      <div class="shrink-0">
        <AppFileSelect
          label="Select LiveSplit file:"
          value={selectedFile()}
          onChange={handleSelectChange}
          filters={[{ name: "LiveSplit (.lss)", extensions: ["lss", "xml"] }]}
        />
      </div>

      <div class="flex shrink-0 flex-wrap items-center justify-center gap-2">
        <Button
          type="button"
          onClick={handleSubmit}
          class="bg-blue-600 text-white hover:bg-blue-700"
        >
          Convert
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleDownload}
          disabled={!result()}
        >
          Download Splits
        </Button>
      </div>

      <div class="grid gap-4 md:min-h-0 md:flex-1 md:grid-cols-2">
        <Show when={fileText()}>
          {(text) => (
            <section
              class="flex h-80 min-w-0 flex-col md:h-auto md:min-h-0"
              classList={{ "md:col-span-2": !result() }}
            >
              <h2 class="mb-2 text-center font-semibold">LiveSplit:</h2>
              <AppSplitPreview text={text()} />
            </section>
          )}
        </Show>
        <Show when={result()}>
          {(converted) => (
            <section class="flex h-80 min-w-0 flex-col md:h-auto md:min-h-0">
              <h2 class="mb-2 text-center font-semibold">LibreSplit:</h2>
              <AppSplitPreview text={converted()} />
            </section>
          )}
        </Show>
      </div>
    </div>
  );
}
