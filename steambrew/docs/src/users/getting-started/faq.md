---
order: 4
description: Questions asked frequently.
---

# FAQ

::: details Antivirus detections?

Although Millennium is open sourced, and cryptographically signed by [SignPath](https://signpath.org/projects?search=millennium); some antivirus solutions may mistakenly identify it as a virus. 

These are [false positives](https://www.huntress.com/cybersecurity-101/topic/false-positive-viruses), often stemming from unrecognized new releases of Millennium that have yet to be heuristically *stamped as safe* by the vendor. 

It's important to approach everything you read online with caution, including this information. We encourage you to verify it yourself—compile, test, and audit Millennium's source code, and you'll find that it behaves exactly as described.

Remember, the best antivirus is a smart end-user!

:::

::: details Can I Get Banned?

No, in short, you will not get banned for using Millennium as it doesn't violate any of Steam's policies. With that said, Millennium, and any of its developers are not responsible for any of your actions, or the potential repercussions nonetheless. Learn more about MIT Licensing [here](https://github.com/SteamClientHomebrew/Millennium/blob/main/LICENSE.md)

:::

::: details Is Millennium against the Steam® Subscriber Agreement?

No, Millennium and all official plugins and themes do not violate Steam's Subscriber Agreement. While Steam strictly prohibits modifying, disassembling, and decompiling services and content distributed through Steam (such as games and applications), these restrictions do not apply to the Steam client software itself.

[Steam Subscriber Agreement](https://store.steampowered.com/subscriber_agreement/)

:::

::: details Is Millennium against the Steam® Privacy Policy?

No, Millennium does not store or log any form of user data and ensures that approved plugins do not store user data without consent.

:::

::: details Where does Millennium save data?

#### Windows

In your Steam folder:

- `wsock32.dll`
- `millennium/` - Millennium Internal Data
- `millennium/plugins/` - User Plugins
- `millennium/themes/` - User Themes

#### Linux

- `/usr/bin/steam` - Patched Steam Binary
- `/usr/lib/millennium/` - Millennium Core Files
- `/usr/share/millennium/` - Millennium Shims
- `~/.local/share/millennium/` - Millennium Skins and Plugins
- `~/.config/millennium/` - Millennium Configuration

:::

::: details How do I uninstall Millennium?

Refer to the [uninstaller guide](../parting-ways/uninstall.md). There you will find documentation on how to uninstall Millennium's components.
:::
