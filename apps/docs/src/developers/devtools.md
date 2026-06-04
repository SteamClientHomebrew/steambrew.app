---
order: 2
description: Learn the tools of the trade.
---

# Developer Tools

Starting Steam in developer mode is rather straight forward, all it requires is passing `-dev` as an argument when launching Steam.

### Windows

On Windows, many developers choose to create a custom shortcut for Steam to launch it into developer mode. To do this, lookup Steam on the start menu, right click it and open its file location. From there, create a copy of the existing Steam shortcut and name it something relevant like **Steam Dev**. Right click your new shortcut and at the end of the target outside the quotes simply add `-dev` (e.g. `"C:\Program Files (x86)\Steam\steam.exe" -dev`). Now, whenever you want to develop your theme, Start steam from this shortcut.

### Linux

Simply start Steam from your terminal emulator with:

```bash
steam -dev
```

## Steam developer tools

::: warning
Using developer tools from http://127.0.0.1:8080 works best from a chromium based browser. Firefox based browsers often have breaking issues where important parts of the developer tools are entirely unusable.
:::

With Steam developer mode enabled, you can now open the Chrome Developer Tools with **CTRL+SHIFT+I** or **F10** (target window must be focused for the developer tools to show).
You can also view all open pages from http://127.0.0.1:8080.

## SharedJSContext

::: tip THEME DEVELOPERS
For the sake of theming you'll likely never need to interact with the `SharedJSContext`, or really know what it is, so just skip this section.
:::

You'll run into it several times whether you're developing a theme or plugin. We'll explain what it is here; it's a concept definitely worth noting.

### What is it? What does it do?

To put it simple, it's the brain of Steam. All of Steams windows are managed from the window `SharedJSContext`. This is a _pseudo_ window of sorts as it's entirely headless and just runs JavaScript that loads other windows.

### What does that imply?

This means the SharedJSContext is important, like _really_ important. It manages all of Steam. Logging in, launching games, retrieving games, opening folders, installing games, the list is enumerable.

Most of the SharedJSContext's child windows have lesser control over the client. They don't have full control quite like the SharedJSContext has. This makes it a very important target for plugin development.

Don't pay too much attention to this right now though, it will be covered in more depth later in the plugin docs!
