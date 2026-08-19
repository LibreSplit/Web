import {
  type ComponentProps,
  createEffect,
  createSignal,
  onCleanup,
  splitProps,
} from "solid-js";
import { Motion } from "solid-motionone";

interface TextScrambleProps extends Omit<ComponentProps<"span">, "children"> {
  children: string;
  speed?: number;
  characterSet?: string;
}

const DEFAULT_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function getRandomChar(charSet: string) {
  return charSet[Math.floor(Math.random() * charSet.length)] ?? "";
}

export const TextScramble = (props: TextScrambleProps) => {
  const [local, motionProps] = splitProps(props, [
    "children",
    "speed",
    "characterSet",
  ]);
  const [text, setText] = createSignal(local.children);

  createEffect(() => {
    const children = local.children;
    const speed = local.speed ?? 50;
    const characterSet = local.characterSet ?? DEFAULT_CHARS;
    let step = 0;
    const interval = setInterval(() => {
      let scrambled = "";

      for (let i = 0; i < children.length; i++) {
        if (i < step) {
          scrambled += children[i];
        } else if (children[i] === " ") {
          scrambled += " ";
        } else {
          scrambled += getRandomChar(characterSet);
        }
      }

      setText(scrambled);
      step++;

      if (step > children.length) {
        clearInterval(interval);
        setText(children);
      }
    }, speed);

    onCleanup(() => clearInterval(interval));
  });

  return <Motion.span {...motionProps}>{text()}</Motion.span>;
};
