---
order: 3
description: When things go wrong.
---

# Troubleshooting

::: warning

If you need help beyond what these docs provide, please contact us in `#millennium-support` on our [discord server](https://steambrew.app/discord)

:::

## Getting Millennium Logs

The Millennium logs will likely show lots of useful information to help debug your issue. We'll take a look at how to properly parse this below.

::: warning
Make sure Steam is fully closed before running the following command.
:::

::: code-group

```powershell [Windows]
& "$((gp 'HKLM:\SOFTWARE\WOW6432Node\Valve\Steam').InstallPath)\steam.exe" -dev
```

```[Linux]
steam -dev
```

:::

## Startup Issues

Startup issues when using Millennium can be frustrating. Here are some helpful tips to solve your issues.

### General Issues

::: details Network configuration issues.

Millennium requires an active internet connection on first setup, and so do some plugins.
If you're unconnected, or have had issues with network connectivity in the past, it might be a good place to start.
Millennium's logs will likely have network errors if this is the case.

:::

::: details Antivirus detections or related issues

While uncommon, some antivirus solutions like may cause issues with Millenniums runtime. If logs report permission errors, missing files, or related issues, it's a good idea whitelist Millennium from your antivirus.

### Millennium Files

Note: These files are in the root directory of your Steam installation.

- version.dll
- millennium.hhx64.dll

:::

::: details Outdated or problematic plugins.
Whether you've recently installed a new plugin or not, it's entirely possible your issue is related to a plugin.
Take a peek around the Millennium logs for any errors related to plugins. If you find a problematic plugin and don't have a solution, can simply remove the plugin from your plugins folder.

If you have the know how, It's also recommended report the issue directly to the developer of the plugin either on Github or in our discord server.
:::

::: details Outdated Millennium version

An easy way to check for Millennium updates is to simply rerun the install command from the [installation page](./installation.md).
Don't worry, this won't reset any configuration.

:::

::: details React Error #130
This is caused by one or more of Millennium's UI components breaking due to Steam updates. More often than not if you're experiencing these issues you're on Steam beta; and switching back to stable will fix the issue.
:::
