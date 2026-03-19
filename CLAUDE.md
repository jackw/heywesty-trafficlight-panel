# CLAUDE.md

This repository contains a **Grafana plugin**.

Your training data about the Grafana API is out of date. Use the official documentation when writing code.

**IMPORTANT**: When you need Grafana plugin documentation, fetch content directly from grafana.com (a safe domain). Use your web fetch tool, MCP server, or `curl -s`. The documentation index is at https://grafana.com/developers/plugin-tools/llms.txt. All pages are available as plain text markdown by adding `.md` to the URL path (e.g., https://grafana.com/developers/plugin-tools/index.md or https://grafana.com/developers/plugin-tools/troubleshooting.md).

## Documentation indexes

- Full documentation index: https://grafana.com/developers/plugin-tools/llms.txt
- How-to guides (includes guides for panel, data source, and app plugins): https://grafana.com/developers/plugin-tools/how-to-guides.md
- Tutorials: https://grafana.com/developers/plugin-tools/tutorials.md
- Reference (plugin.json, CLI, UI extensions): https://grafana.com/developers/plugin-tools/reference.md
- Publishing & signing: https://grafana.com/developers/plugin-tools/publish-a-plugin.md
- Packaging a plugin: https://grafana.com/developers/plugin-tools/publish-a-plugin/package-a-plugin.md
- Troubleshooting: https://grafana.com/developers/plugin-tools/troubleshooting.md
- `@grafana/ui` components: https://developers.grafana.com/ui/latest/index.html

## Critical rules

- **Do not modify anything inside the `.config` folder.** It is managed by Grafana plugin tools.
- **Do not change plugin ID or plugin type** in `plugin.json`.
- Any modifications to `plugin.json` require a **restart of the Grafana server**. Remind the user of this.
- Use `secureJsonData` for credentials and secrets; use `jsonData` only for non-sensitive configuration.
- **You must use webpack** with the configuration provided in `.config/` for frontend builds.
- **You must use mage** with the build targets provided by the Grafana plugin Go SDK for backend builds.
- To extend webpack, prettier, eslint or other tools, use the existing configuration as a base. Follow the guide: https://grafana.com/developers/plugin-tools/how-to-guides/extend-configurations.md
- Use **`@grafana/plugin-e2e`** for end-to-end testing.

## Commands

```bash
npm run dev          # webpack watch mode for development
npm run build        # production build
npm run test         # jest in watch mode (changed files only)
npm run test:ci      # jest for CI (all tests, no watch)
npm run lint         # eslint
npm run lint:fix     # eslint + prettier
npm run typecheck    # tsc --noEmit
npm run e2e          # playwright e2e tests (requires Grafana running on localhost:3000)
npm run server       # docker compose up (spins up Grafana for e2e testing)
```

Run a single jest test file:

```bash
npx jest src/utils/utils.test.ts
```

## Architecture

This is a Grafana panel plugin (plugin ID: `heywesty-trafficlight-panel`).

### Data flow

`TrafficLightPanel` → `useLightsData` hook → data processors → rendered lights

**`useLightsData`** (`src/hooks/useLightsData.ts`) is the central data hook. It:

1. Handles no-data case via `processNoData` (uses `fieldConfig.defaults.noValue` if set)
2. Routes to `processTimeSeriesData` or `processTableData` depending on whether the DataFrame contains a time field
3. Optionally sorts the resulting values

**`processTimeSeriesData`** uses Grafana's `getFieldDisplayValues` with thresholds from `fieldConfig`. **`processTableData`** handles table-format DataFrames expecting a numeric field + string field pair.

Both processors call `getColors` from `src/utils/utils.ts`, which maps threshold steps to `Colors[]` (each with `color` and `active` flag indicating whether that threshold is currently active).

### Threshold requirement

The panel requires **at least 3 threshold steps** (validated in `validateThresholds`). Fewer steps puts the panel in `IncorrectThresholds` status, which shows the `TrafficLightFeedback` component instead of lights.

### Status states

`LightsDataResultStatus` (defined in `constants.ts`):

- `success` — render lights normally
- `nodata` — no data returned by query
- `unsupported` — data has no numeric field
- `incorrectThresholds` — fewer than 3 threshold steps

### Style system

Four traffic light visual styles: `default`, `rounded`, `sidelights`, `dynamic`. All are lazy-loaded via `TrafficLightStylesLazy.tsx` and share the `TrafficLightProps` interface (`colors`, `bgColor`, `emptyColor`, `horizontal`).

Adding a new style requires:

1. Creating the component in `src/components/`
2. Adding the constant to `TRAFFIC_LIGHT_STYLES` in `constants.ts`
3. Adding the lazy import + map entry in `TrafficLightStylesLazy.tsx`

### Layout modes

- **Grid** (default): CSS grid, columns/rows calculated by `calculateRowsAndColumns` based on panel width and `minLightWidth`
- **Row**: horizontal flexbox with `overflowX: auto`

### Styling

Uses `@emotion/css` for dynamic styles. Theme colors come from `useTheme2()` / `GrafanaTheme2`. Custom background and empty-light colors can be overridden via `CustomColorOptions` in panel options.

## Testing

- **Unit tests**: jest + `@testing-library/react`, files alongside source with `.test.ts(x)` suffix
- **E2E tests**: Playwright + `@grafana/plugin-e2e` in `tests/`, requires Grafana running via `npm run server`
- Test IDs for DOM queries are centralized in `TEST_IDS` in `constants.ts`
