---
order: 1
description: Quick guide to installing Millennium.
---

# Installation

## Windows

To install Millennium on **Windows**, we use an installer module. This installer is [cryptographically signed](https://signpath.org/) and [open source](https://github.com/SteamClientHomebrew/Installer); we encourage the community to audit the source code!

[📥 MillenniumInstaller-Windows.exe](https://github.com/SteamClientHomebrew/Installer/releases/latest/download/MillenniumInstaller-Windows.exe)

## Linux

::: warning
We don't support Steam installed via [Flatpak](https://flatpak.org/) or [Snap](https://snapcraft.io/).
We also don't support any ARM based distributions as they require custom Steam installations.
:::

::: tip
Looking to package Millennium for your favorite distribution? It should be a relatively simple process, the filesystem hierarchy is easily change-able [here](https://github.com/SteamClientHomebrew/Millennium/blob/main/src/sys/env.cc). From there you can build Millennium to use any filesystem standard!
:::

::: details Arch Linux (AUR)

We officially offer support for Millennium on the [Arch User Repository (AUR)](https://aur.archlinux.org/packages/millennium).

#### Post Installation

After installing Millennium through the AUR, simply launch steam.

:::

::: details NixOS

We officially offer nix package for millennium. Currently, it isn't available in nixpkgs, but you can use our flake.

- Step 1 is done in flake.nix file.
- Steps 2, 3.a, 3.b are done in configuration.nix file.

1. Add input to your flake:

```nix
millennium.url = "github:SteamClientHomebrew/Millennium?dir=packages/nix";
```

2. Import millennium overlay:

```nix
nixpkgs.overlays = [ inputs.millennium.overlays.default ];
```

3.a If you're using a NixOS Steam module, set millennium as the Steam package:

```nix
programs.steam = {
  enable = true;
  package = pkgs.millennium-steam;
};
```

3.b If you're not using the Steam module, just replace steam with millennium in your list of packages:

```nix
environment.systemPackages = [
  # Your other packages...
  inputs.millennium.packages."${pkgs.system}".millennium-steam
];
```

:::

::: details Other Distributions

### Automatic

**Shell (pre-built binary)**

This installer is entirely open source and we encourage the community audit the [source code](https://github.com/SteamClientHomebrew/Millennium/blob/main/scripts/install.sh).

```bash
curl -fsSL "https://steambrew.app/install.sh" | bash
```

:::
