import { PacmanLoader } from "../components/ui/loaders";

export function NotFound() {
  return (
    <div class="flex flex-1 flex-col items-center justify-center space-y-4">
      <PacmanLoader color="#2196f3" />
      <p>Not found.</p>
    </div>
  );
}
