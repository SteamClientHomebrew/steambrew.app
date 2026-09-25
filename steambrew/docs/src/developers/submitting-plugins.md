---
order: 5
description: Plugin submission guide.
---

# Submitting Plugins

Create a new pull request on the [plugin
database](https://github.com/SteamClientHomebrew/PluginDatabase) repository with
the information about your plugin attached. For more information, consult the
README.

Every time you make a change to your repository, you'll need to open a new
update pull request, and it will have to be successfully merged before
Millennium users can download and use it. Although this may seem frustrating, we
prioritize the safety of our end-users over developer convenience.

## Approval Process

Your code will be checked for quality and whether it follows our guidelines.
Reviewers may request changes before approval.

After the review, your plugin will be tested by other people to confirm that it
is currently safe and sound.

Due to our small team size, we cannot guarantee how long a review will take. If
your plugin is approved, it will appear on https://steambrew.app/plugins. The
website will automatically render your repository's README and relevant data.

## Guidelines

1. Your plugin must not be primarily AI-generated

   Plugin developers are expected to have some basic skills in order to fix
   their plugins whenever Steam decides to update. This also applies to your PR
   template. If AI-assisted, a disclosure is required. You might be tempted to
   try to make the generated code "look more human" or similar, but such tricks
   are absolutely not allowed.

2. Your plugin must have functionality specific to the Steam client

   If the only thing your plugin does is add or hide a button from the Steam
   store, it's better off as a Chrome extension, which Extendium, one of our
   plugins, already provides. No, having plugin settings in the Millennium
   sidebar does not count.

3. Look native to Steam

   The `@steambrew/client` (or `millennium` if you are using starlight) package
   exports multiple components that Steam uses throughout its client. See [this
   page](../plugins/ts/components). Any plain HTML elements are forbidden unless
   Steam doesn't have the component you are looking for.

4. Themes are not plugins' business!

   Do not support specific themes or advertise a theme as working better or
   worse than another. Plugins' only business is making their components look
   native to Steam; themes can handle the rest.

   Note that you may still want to help themes have a better experience with
   theming your plugin.
