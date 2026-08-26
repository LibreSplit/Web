import { Download } from "lucide-solid";
import { Match, Switch } from "solid-js";

import { GitHubIcon } from "@/assets/icons/GitHubIcon";
import { buttonVariants } from "@/components/ui/button";
import { CommandBlock } from "@/components/ui/CommandBlock";
import { DistroType } from "@/lib/utils";

export function InstallationInstructions(props: { distro: DistroType }) {
  return (
    <Switch>
      <Match when={props.distro === DistroType.FEDORA}>
        <p>Download the RPM:</p>
        <div class="flex flex-wrap gap-2">
          <a
            class={buttonVariants({ variant: "outline", size: "sm" })}
            href="https://rpm.libresplit.org/libresplit.x86_64.rpm"
          >
            <Download />
            x86_64 (AMD/Intel)
          </a>
          <a
            class={buttonVariants({ variant: "outline", size: "sm" })}
            href="https://rpm.libresplit.org/libresplit.aarch64.rpm"
          >
            <Download />
            ARM64
          </a>
        </div>
        <p>Or install via CLI:</p>
        <CommandBlock
          command={`sudo dnf install "https://rpm.libresplit.org/libresplit.$(uname -m).rpm`}
        />
        <p>
          Official RPM packages are signed with the{" "}
          <a
            class="text-primary underline underline-offset-4 hover:text-primary/80"
            href="https://rpm.libresplit.org/RPM-GPG-KEY-libresplit"
            target="_blank"
          >
            LibreSplit RPM signing key
          </a>
        </p>
        <p>You can verify the package using the following fingerprint:</p>
        <CommandBlock command="AE81 2B2C ED7C D507 FCD1  B39E 10C0 57F4 106B 63CB" />
      </Match>
      <Match when={props.distro === DistroType.ARCH}>
        <p>
          LibreSplit is available on the Arch User Repository (AUR). You can
          install it with your AUR manager of choice:
        </p>
        <CommandBlock
          command={`# using yay
yay -S libresplit-git

# using paru
paru -S libresplit-git`}
        />
        <p>
          See the{" "}
          <a
            class="text-primary underline underline-offset-4 hover:text-primary/80"
            href="https://aur.archlinux.org/packages/libresplit-git"
            target="_blank"
          >
            package on the AUR.
          </a>
        </p>
      </Match>
      <Match when={props.distro === DistroType.NIX}>
        <p>
          See the{" "}
          <a
            class="text-primary underline underline-offset-4 hover:text-primary/80"
            href="https://search.nixos.org/packages?channel=25.05&show=libresplit&query=libresplit"
            target="_blank"
          >
            libresplit
          </a>{" "}
          package, courtesy of{" "}
          <a
            class="text-primary underline underline-offset-4 hover:text-primary/80"
            href="https://github.com/fgaz"
            target="_blank"
          >
            @fgaz
          </a>
          .
        </p>
      </Match>
      <Match when={props.distro === DistroType.OTHER}>
        <p>
          LibreSplit also packages an AppImage which is available for download
          on github from the releases section.
        </p>
        <a
          class={buttonVariants({ variant: "outline", size: "sm" })}
          href="https://github.com/LibreSplit/LibreSplit/releases/latest"
          target="_blank"
        >
          <GitHubIcon />
          Latest Release
        </a>
        <p>
          If an AppImage is not suitable then you may also download the packaged
          source from the release above and follow the build instructions below
          to build LibreSplit for your system.
        </p>
      </Match>
    </Switch>
  );
}
