# Heywesty Traffic Light panel

[![CI](https://github.com/jackw/heywesty-trafficlight-panel/actions/workflows/ci.yml/badge.svg)](https://github.com/jackw/heywesty-trafficlight-panel/actions/workflows/ci.yml)&nbsp;&nbsp;![Latest Version Badge](https://img.shields.io/badge/dynamic/json?logo=grafana&query=$.version&url=https://grafana.com/api/plugins/heywesty-trafficlight-panel&label=Version&prefix=v&color=F47A20)

A traffic light to help you interpret complex information at a glance.

<img width="500px" alt="Ten traffic lights in a grid, each with its series name, value and trend color" src="https://raw.githubusercontent.com/jackw/heywesty-trafficlight-panel/main/src/img/screenshots/traffic-lights-grid-layout.png" />

The panel uses Grafana thresholds to turn each value into a stop, ready or go light, so you can see the state of many services or metrics without reading the numbers. For setup and options, refer to the [documentation](https://grafana.com/grafana/plugins/heywesty-trafficlight-panel/docs/).

## Features

- **Customizable traffic light width:** Set the minimum width for each traffic light.
- **Grid or single row layout:** Lay out traffic lights in a grid or in a single row.
- **Reversible light colors:** Reverse the order of traffic light colors.
- **Sorting options:** Sort traffic lights by value in ascending or descending order, or keep the series order.
- **Value display:** Show or hide the value of each traffic light.
- **Legend display:** Show or hide the legend (series or row name) of each traffic light.
- **Trend display:** Show or hide the trend color.
- **Traffic light style:** Pick a style of traffic light. For a custom number of lights, use the **Dynamic** style.
- **Orientation flexibility:** Choose a vertical or horizontal layout for the traffic lights.
- **Custom colors:** Set your own background and empty light colors for the dark and light themes.
- **Time series and table data:** Show one traffic light per series, or one per table row.
- **Data links:** Click a traffic light to open its data link, or pick from a menu when it has several.
