import AppFileSelect from "@/components/libresplit/AppFileSelect";
import { AppSplitPreview } from "@/components/libresplit/AppSplitPreview";
import init, { convert } from "@libresplit/converter";
import wasmUrl from "@libresplit/converter/converter_bg.wasm?url";
import { Show, createSignal } from "solid-js";

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
    <div class="flex h-[calc(100vh-64px-24px)] flex-col space-y-4 overflow-hidden">
      <div class="shrink-0 px-25">
        <AppFileSelect
          label="Select LiveSplit file:"
          value={selectedFile()}
          onChange={handleSelectChange}
          filters={[{ name: "LiveSplit (.lss)", extensions: ["lss", "xml"] }]}
        />
      </div>

      <div class="flex shrink-0 items-center justify-center gap-2">
        <button
          onClick={handleSubmit}
          class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Convert
        </button>
        <button
          onClick={handleDownload}
          disabled={!result()}
          class="rounded bg-gray-200 px-4 py-2 text-black disabled:opacity-50"
        >
          Download Splits
        </button>
      </div>

      <div class="min-h-0 flex-1">
        <div class="flex h-full min-h-0 w-full items-stretch justify-center gap-4">
          <Show when={fileText()}>
            {(text) => (
              <div class="flex min-h-0 flex-1 flex-col">
                <span class="mb-2 text-center font-semibold">LiveSplit:</span>
                <AppSplitPreview text={text()} class="h-full flex-1" />
              </div>
            )}
          </Show>
          <Show when={result()}>
            {(converted) => (
              <div class="flex min-h-0 flex-1 flex-col">
                <span class="mb-2 text-center font-semibold">LibreSplit:</span>
                <AppSplitPreview text={converted()} class="h-full flex-1" />
              </div>
            )}
          </Show>
        </div>
      </div>
    </div>
  );
}
