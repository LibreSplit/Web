import { makePersisted } from "@solid-primitives/storage";
import {
  type ParentProps,
  createContext,
  createEffect,
  createSignal,
  onCleanup,
  useContext,
} from "solid-js";

type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue>();

export function ThemeProvider(props: ParentProps) {
  const [theme, setTheme] = makePersisted(createSignal<Theme>("system"), {
    name: "theme",
    serialize: (value: Theme) => value,
    deserialize: (value): Theme =>
      value === "light" || value === "dark" || value === "system"
        ? value
        : "system",
  });

  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const [systemIsDark, setSystemIsDark] = createSignal(systemTheme.matches);

  createEffect(() => {
    const resolved =
      theme() === "system" ? (systemIsDark() ? "dark" : "light") : theme();

    const style = document.createElement("style");
    style.textContent =
      "*,*::before,*::after{transition:none!important;animation-duration:0s!important}";
    document.head.append(style);

    document.documentElement.classList.toggle("dark", resolved === "dark");
    document.documentElement.style.colorScheme = resolved;

    window.getComputedStyle(style).opacity;
    const frame = requestAnimationFrame(() => style.remove());

    onCleanup(() => {
      cancelAnimationFrame(frame);
      style.remove();
    });
  });

  const handleSystemThemeChange = (event: MediaQueryListEvent) => {
    setSystemIsDark(event.matches);
  };

  systemTheme.addEventListener("change", handleSystemThemeChange);
  onCleanup(() =>
    systemTheme.removeEventListener("change", handleSystemThemeChange),
  );

  return (
    <ThemeContext.Provider value={{ setTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
