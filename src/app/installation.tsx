import { InstallationSection } from "@/app/installation/InstallationSection";

export function Installation() {
  return (
    <div class="mt-20 flex w-full flex-col gap-20">
      <section>
        <h1 class="lg-text-5xl mb-10 scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
          Installation Instructions
        </h1>
        <div class="flex w-full min-w-0 flex-col items-center">
          <InstallationSection />
        </div>
      </section>
    </div>
  );
}
