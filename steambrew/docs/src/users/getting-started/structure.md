# File System Structure

Here's where to find everything! Use this handy reference when you need to locate specific files and folders.

::: tip
The abbreviation `%STEAM%` is just a placeholder for your actual Steam path. If you're unsure where Steam is installed, checkout [how to find your steam path](../guides/finding-steam.md)
:::

## Windows

| Component                  | Absolute Path                                    |
| -------------------------- | ----------------------------------------------   |
| Millennium                 | `%STEAM%/wsock32.dll`, `%STEAM%/millennium/lib/` |
| Millennium Assets          | `%STEAM%/millennium/bin/`                        |
| Plugins                    | `%STEAM%/millennium/plugin`                      |
| Themes                     | `%STEAM%/millennium/themes`                      |
| Logs                       | `%STEAM%/millennium/logs`                        |
| User Config                | `%STEAM%/millennium/config`                      |

## Linux

| Component                  | Absolute Path                       |
| -------------------------- | ----------------------------------- |
| Millennium                 | `/usr/lib/millennium`               |
| Millennium Assets          | `/usr/share/millennium/assets`      |
| Millennium API             | `/usr/share/millennium/shims`       |
| Plugins                    | `~/.local/share/millennium/plugins` |
| Themes                     | `~/.steam/steam/steamui/skins`      |
| Logs                       | `~/.local/share/millennium/logs`    |
| User Config                | `~/.config/millennium`              |
| Plugin Runtime Environment | `~/.local/share/millennium/.venv`   |
