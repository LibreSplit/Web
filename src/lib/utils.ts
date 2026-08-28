import { type ClassValue, clsx } from "clsx";
import type { Component, ComponentProps } from "solid-js";
import { twMerge } from "tailwind-merge";

import { ArchLinux } from "@/assets/distros/ArchLinux";
import { Fedora } from "@/assets/distros/Fedora";
import { Linux } from "@/assets/distros/Linux";
import { NixOS } from "@/assets/distros/NixOS";

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

export type DistroLogo = Component<ComponentProps<"svg">>;

export interface Distro {
  type: DistroType;
  label: string;
  logo: DistroLogo;
  desc?: string;
}

export const SUPPORTED_DISTROS = [
  {
    type: DistroType.FEDORA,
    label: "Fedora",
    logo: Fedora,
    desc: "Fedora and RHEL based distros (Fedora, Nobara, Rocky Linux, etc.)",
  },
  { type: DistroType.ARCH, label: "Arch Linux", logo: ArchLinux },
  { type: DistroType.NIX, label: "NixOS", logo: NixOS },
  { type: DistroType.OTHER, label: "Other", logo: Linux },
] as const satisfies readonly Distro[];
