# Changelog

## 0.5.0

- Feat: Dynamic Lights style allowing any number of lights to be used
- Fix: Sort should sort numerically
- Chore: Bump @grafana/create-plugin configuration to 5.5.3
- CI: Update all GH workflows to latest create-plugin

## 0.4.1

- Chore: Bump @grafana/create-plugin configuration to 5.3.9

## 0.4.0

- Feature: Support table data
- Chore: fix license file
- Chore: Bump @grafana/create-plugin configuration to 4.16.2
- Deps: bump ws from 8.13.0 to 8.17.1

## 0.3.1

- Bug: Fix queries with a single field
- Chore: Bump @grafana/create-plugin configuration to 4.12.0
- CI: introduce cp update workflow

## 0.3.0

- Add new option to reverse the order of colors in traffic lights
- Add new option to show only the legend (query name) below traffic lights
- Clean up e2e tests with test ids const and bumping plugin-e2e to 1.x.x
- Introduce e2e tests for TrafficLightValue component

## 0.2.0

- Add a new option to select different traffic light styles (`default`, `rounded`, `side-lights`)
- Add some basic tests for utils
- Add plugin-e2e package with playwright for e2e tests
- Fix bugs with `calculateRowsAndColumns` where itemcount and containerWidth weren't being considered causing potential layout breakages
- Fix a bug with `calculateRowsAndColumns` using `data.series.length` causing broken layouts due to returning a different length to useDatas `values` which we should consider the source of truth.

## 0.1.0

Initial release.
