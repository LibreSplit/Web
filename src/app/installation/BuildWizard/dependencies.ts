export interface BuildDependency {
  name: string;
  purpose: string;
  url: string;
}

export const DEPENDENCIES = [
  {
    name: "C toolchain",
    purpose: "Compiles LibreSplit",
    url: "https://gcc.gnu.org/",
  },
  {
    name: "Git",
    purpose: "Downloads the source code",
    url: "https://git-scm.com/",
  },
  {
    name: "Meson",
    purpose: "Configures and runs the build",
    url: "https://mesonbuild.com/",
  },
  {
    name: "GTK 3",
    purpose: "Provides the desktop interface",
    url: "https://docs.gtk.org/gtk3/",
  },
  {
    name: "X11",
    purpose: "Provides global hotkey support on X11",
    url: "https://www.x.org/wiki/",
  },
  {
    name: "Jansson",
    purpose: "Reads JSON split files",
    url: "https://jansson.readthedocs.io/",
  },
  {
    name: "LuaJIT",
    purpose: "Runs Lua auto splitters",
    url: "https://luajit.org/",
  },
  {
    name: "OpenSSL",
    purpose: "Provides the Lua md5sum function",
    url: "https://www.openssl.org/",
  },
] as const satisfies readonly BuildDependency[];

export const OPTIONAL_DEPENDENCIES = [
  {
    name: "GVfs",
    purpose: "Loads split icons from the web",
    url: "https://wiki.gnome.org/Projects/gvfs",
  },
  {
    name: "GLib Networking",
    purpose: "Adds network support for web split icons",
    url: "https://gitlab.gnome.org/GNOME/glib-networking",
  },
] as const satisfies readonly BuildDependency[];

export interface DistributionBuildInstructions {
  id: string;
  name: string;
  family: string;
  requiredPackages: string[];
  optionalPackages: string[];
  requiredCommand: string | string[];
  optionalCommand: string | string[];
  instructions?: string;
  packageIndexUrl: string;
  packageUrl: (packageName: string) => string;
}

export const DISTRO_DEPENDENCIES = [
  {
    id: "fedora",
    name: "Fedora",
    family: "Fedora and RHEL based distros",
    requiredPackages: [
      "binutils",
      "gcc",
      "git",
      "gtk3-devel",
      "jansson-devel",
      "libX11-devel",
      "luajit-devel",
      "meson",
      "openssl-devel",
    ],
    optionalPackages: ["glib-networking", "gvfs"],
    requiredCommand:
      "sudo dnf install binutils gcc git gtk3-devel jansson-devel libX11-devel luajit-devel meson openssl-devel",
    optionalCommand: "sudo dnf install glib-networking gvfs",
    packageIndexUrl: "https://packages.fedoraproject.org/",
    packageUrl: (packageName) =>
      `https://packages.fedoraproject.org/search?query=${encodeURIComponent(packageName)}`,
  },
  {
    id: "debian",
    name: "Debian",
    family: "Debian and Ubuntu based distros",
    requiredPackages: [
      "build-essential",
      "git",
      "libgtk-3-dev",
      "libjansson-dev",
      "libluajit-5.1-dev",
      "libssl-dev",
      "libx11-dev",
      "meson",
    ],
    optionalPackages: ["glib-networking", "gvfs"],
    requiredCommand: [
      "sudo apt update",
      "sudo apt install build-essential git libgtk-3-dev libjansson-dev libluajit-5.1-dev libssl-dev libx11-dev meson",
    ],
    optionalCommand: "sudo apt install glib-networking gvfs",
    packageIndexUrl: "https://packages.debian.org/",
    packageUrl: (packageName) =>
      `https://packages.debian.org/search?keywords=${encodeURIComponent(packageName)}&searchon=names&suite=stable&section=all`,
  },
  {
    id: "arch",
    name: "Arch Linux",
    family: "Arch based distros",
    requiredPackages: [
      "base-devel",
      "git",
      "gtk3",
      "jansson",
      "libx11",
      "luajit",
      "meson",
      "openssl",
    ],
    optionalPackages: ["glib-networking", "gvfs"],
    requiredCommand:
      "sudo pacman -Syu --needed base-devel git gtk3 jansson libx11 luajit meson openssl",
    optionalCommand: "sudo pacman -S --needed glib-networking gvfs",
    packageIndexUrl: "https://archlinux.org/packages/",
    packageUrl: (packageName) =>
      `https://archlinux.org/packages/?q=${encodeURIComponent(packageName)}`,
  },
  {
    id: "nixos",
    name: "NixOS",
    family: "NixOS",
    requiredPackages: [
      "git",
      "meson",
      "ninja",
      "pkg-config",
      "gtk3",
      "libx11",
      "jansson",
      "luajit",
      "openssl",
    ],
    optionalPackages: ["gvfs", "glib-networking"],
    requiredCommand:
      "nix-shell -p git meson ninja pkg-config gtk3 libx11 jansson luajit openssl",
    optionalCommand:
      "nix-shell -p git meson ninja pkg-config gtk3 libx11 jansson luajit openssl gvfs glib-networking",
    instructions:
      "Choose one temporary development shell before following the build steps. Nix's standard environment supplies the compiler and linker; the second shell adds the optional web-icon packages.",
    packageIndexUrl: "https://search.nixos.org/packages",
    packageUrl: (packageName) =>
      `https://search.nixos.org/packages?channel=stable&query=${encodeURIComponent(packageName)}`,
  },
] as const satisfies readonly DistributionBuildInstructions[];
