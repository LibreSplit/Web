import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import archLogo from "@/assets/distros/arch-linux.svg";
import fedoraLogo from "@/assets/distros/fedora.svg";
import linuxLogo from "@/assets/distros/linux.svg";
import nixLogo from "@/assets/distros/nixos.svg";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const DistroType = {
  ARCH: "arch-linux",
  FEDORA: "fedora",
  NIX: "nixos",
  OTHER: "other",
} as const;

export type DistroType = (typeof DistroType)[keyof typeof DistroType];

export interface Distro {
  type: DistroType;
  label: string;
  logo: string;
  desc?: string;
}

export const SUPPORTED_DISTROS = [
  {
    type: DistroType.FEDORA,
    label: "Fedora",
    logo: fedoraLogo,
    desc: "Fedora and RHEL based distros (Fedora, Nobara, Rocky Linux, etc.)",
  },
  { type: DistroType.ARCH, label: "Arch Linux", logo: archLogo },
  { type: DistroType.NIX, label: "NixOS", logo: nixLogo },
  { type: DistroType.OTHER, label: "Other", logo: linuxLogo },
] as const satisfies readonly Distro[];
