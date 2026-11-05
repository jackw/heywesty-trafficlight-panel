# Traffic Light documentation

This folder is the documentation for **Traffic Light**. Grafana publishes it on the **Documentation** tab of
`grafana.com/grafana/plugins/heywesty-trafficlight-panel/` with each plugin release. This README isn't published.

To learn how plugin docs work and how to write them, refer to
[Add documentation to your plugin](https://grafana.com/developers/plugin-tools/how-to-guides/plugin-docs).

## Update the docs

1. Edit the pages in this folder when the plugin's options or behavior change.
1. Save screenshots, videos, and figures in `img/` and link to them with a relative path. `npm run docs:validate` checks their formats and sizes.
1. Run `npm run docs:serve` to preview the docs.

## Commands

```bash
npm run docs:serve     # local preview at http://localhost:3001
npm run docs:validate  # check your docs, including sections left to fill
```
