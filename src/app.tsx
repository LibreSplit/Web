import { AppNav } from "./components/libresplit/AppNav";
import type { ParentProps } from "solid-js";

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
