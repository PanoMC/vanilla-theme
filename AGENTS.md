# AGENTS.md

This repo's own notes for agents are in `CLAUDE.md`: read it too.

<!-- pano-agent-guide:start -->
## Agent guide

You are in a **Pano theme** (a thin repo on `@panomc/theme-core`).

Read `agent-guide/README.md` first, then **only** the topic file it points to for your task. Decide from the
request and the code; ask only where the guide says a wrong guess is costly. `agent-guide/` is a synced copy: edit it
in `theme-core/agent-guide/` (repo `PanoMC/sdk`) and run `bun scripts/sync-agent-guide.js` there.

The three rules you will break first:

1. Take the cheapest step: tokens and CSS on semantic classes first, `eject-view` only for structure, `<PluginBlock>` to move a piece; new data or behaviour belongs to the plugin, not the theme (`theme-plugin-ui.md`).
2. Overrides are ejected and registered in `theme.config.js` with their contract; keep every slot, hook and root class; a mismatch falls back to the default view (`theme-override-view.md`).
3. `src/routes/`, `src/lib/`, `lang/` and `plugin-contracts/` are generated; pages, renames and the home page are keys of `theme.config.js`. `theme-core check --strict` must pass (`theme-routes-home.md`, `testing.md`).
<!-- pano-agent-guide:end -->
