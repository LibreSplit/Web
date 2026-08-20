import type { ParentProps } from "solid-js";

import { AppNav } from "./components/libresplit/AppNav";

export default function App(props: ParentProps) {
  return (
    <div>
      <div>
        <AppNav />
      </div>
      <div class="px-2">{props.children}</div>
    </div>
  );
}
