import type { ParentProps } from "solid-js";

import { AppNav } from "./components/libresplit/AppNav";

export default function App(props: ParentProps) {
  return (
    <div class="flex min-h-dvh flex-col">
      <AppNav />
      <main class="mx-auto flex w-full max-w-5xl min-w-0 flex-1 flex-col px-4 py-6 sm:px-6 md:min-h-0 md:py-8 lg:px-8">
        {props.children}
      </main>
    </div>
  );
}
