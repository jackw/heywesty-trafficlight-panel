# Changelog

## 0.2.0

- Add a new option to select different traffic light styles (`default`, `rounded`, `side-lights`)
- Add some basic tests for utils
- Add plugin-e2e package with playwright for e2e tests
- Fix bugs with `calculateRowsAndColumns` where itemcount and containerWidth weren't being considered causing potential layout breakages
- Fix a bug with `calculateRowsAndColumns` using `data.series.length` causing broken layouts due to returning a different length to useDatas `values` which we should consider the source of truth.

## 0.1.0

Initial release.
