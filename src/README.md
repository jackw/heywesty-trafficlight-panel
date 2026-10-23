# Heywesty Traffic light panel

[![CI](https://github.com/jackw/heywesty-trafficlight-panel/actions/workflows/ci.yml/badge.svg)](https://github.com/jackw/heywesty-trafficlight-panel/actions/workflows/ci.yml)&nbsp;&nbsp;![Latest Version Badge](https://img.shields.io/badge/dynamic/json?logo=grafana&query=$.version&url=https://grafana.com/api/plugins/heywesty-trafficlight-panel&label=Version&prefix=v&color=F47A20)

A traffic light to help you interpret complex information at a glance.

<img width="500px" src="https://raw.githubusercontent.com/jackw/heywesty-trafficlight-panel/main/src/img/screenshots/traffic-lights-grid-layout.png" />

The panel uses Grafana thresholds to turn each value into a stop, ready or go light, so you can see the state of many services or metrics without reading the numbers. For setup and options, refer to the [documentation](https://grafana.com/grafana/plugins/heywesty-trafficlight-panel/docs/).

## Features

- **Customizable Traffic Light Width:** Set the minimum width for each traffic light.
- **Grid/Single Row Layout:** Ability to layout lights on a grid or in a single row.
- **Reversible light colors:** Reverse the order of traffic light colors.
- **Sorting Options:** Sort the traffic lights based on values in ascending, descending, or series (none) order.
- **Value Display:** Option to show or hide the values associated with each light.
- **Legend Display:** Option to show or hide the legend (query name) associated with each light.
- **Trend Display:** Show or hide the trend color to provide an additional layer of information.
- **Traffic Light Style:** Pick a style of traffic light. If you want a custom number of lights use dynamic.
- **Orientation Flexibility:** Choose between a vertical or horizontal layout for the traffic lights.
- **Custom Colors:** Set your own background and empty light colors for the dark and light themes.
- **Time Series and Table Data:** Show one light per series, or one light per table row.
- **Data Links:** Click a light to open its data links.
