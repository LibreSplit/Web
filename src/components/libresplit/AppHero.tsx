import { TextScramble } from "../ui/text-scramble";

export function AppHero() {
  return (
    <div class="flex flex-col items-center justify-center">
      <img
        src="https://raw.githubusercontent.com/LibreSplit/LibreSplit/refs/heads/main/assets/libresplit.svg"
        alt="LibreSplit"
        class="w-64"
      />
      <p class="text-bold text-6xl">LibreSplit</p>
      <TextScramble characterSet="_" speed={28}>
        Free speedrun timer with auto splitting and load removal for Linux.
      </TextScramble>
    </div>
  );
}
