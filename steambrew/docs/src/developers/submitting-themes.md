---
order: 6
description: Theme submission guide.
---

# Submitting Themes

Create a new pull request on the [theme
database](https://github.com/SteamClientHomebrew/ThemeDatabase) repository that
adds your theme to `metadata.json`:

```json
{ "owner": "YourUsername", "repo": "YourRepository" }
```

If your readme is not `README.md`, point to it with the optional `readme` field:

```json
{ "owner": "YourUsername", "repo": "YourRepository", "readme": "docs/millennium.md" }
```

This is done only once - unlike plugins, which require submitting a pull request
for new versions, themes will automatically update whenever you make a commit to
your repository's default branch.

If your theme is approved, it will appear on https://steambrew.app/themes as
soon as the pull request is merged. The website will automatically render your
repository's README and other relevant data from your `skin.json`.

## Requirements

Your repository must have a `skin.json` at its root. A check runs on your pull
request and will fail unless the following are true:

1. `github` matches your entry

   The `owner` and `repo_name` in your `skin.json` must match the repository you
   added to `metadata.json`.

   ```json
   "github": {
       "owner": "YourUsername",
       "repo_name": "YourRepository"
   }
   ```

2. `header_image` and `splash_image` are valid

   Both must be `https` URLs that load an image. They are what the website
   shows for your theme, so make sure they still work after you merge.

   ```json
   "header_image": "https://raw.githubusercontent.com/YourUsername/YourRepository/main/media/library.png",
   "splash_image": "https://raw.githubusercontent.com/YourUsername/YourRepository/main/media/gamepage.png"
   ```

For a complete example, see the
[Overdrive](https://github.com/OriginalSwayze/Overdrive/blob/main/skin.json)
`skin.json`.

## Removing A Theme

Open a pull request that deletes your entry from `metadata.json`. The theme is
hidden from the website, and its download count is kept in case it is added back
later.
