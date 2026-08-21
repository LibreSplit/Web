import { TextScramble } from "../ui/text-scramble";

export function AppHero() {
  return (
    <div class="flex w-full flex-col items-center justify-center py-4 text-center md:py-6">
      <img
        src="https://raw.githubusercontent.com/LibreSplit/LibreSplit/refs/heads/main/assets/libresplit.svg"
        alt="LibreSplit"
        class="w-48 md:w-64"
      />
      <p class="text-4xl font-bold sm:text-5xl md:text-6xl">LibreSplit</p>
      <TextScramble
        characterSet="_"
        speed={28}
        class="mt-2 max-w-xl text-sm text-pretty text-muted-foreground sm:text-base"
      >
        Free speedrun timer with auto splitting and load removal for Linux.
      </TextScramble>
    </div>
  );
}
