# Heywesty Traffic light panel plugin

[![CI](https://github.com/jackw/heywesty-trafficlight-panel/actions/workflows/ci.yml/badge.svg)](https://github.com/jackw/heywesty-trafficlight-panel/actions/workflows/ci.yml)

![Latest Version Badge](https://img.shields.io/badge/dynamic/json?logo=grafana&query=$.version&url=https://grafana.com/api/plugins/heywesty-trafficlight-panel&label=Version&prefix=v&color=F47A20)

A traffic light for your data to help you interpret complex information at a glance.

## Requirements

Grafana >=10.0.0

## Features

- **Customizable Traffic Light Width:** Set the minimum width for each traffic light.
- **Value Display:** Option to show or hide the values associated with each light.
- **Trend Display:** Show or hide the trend color to provide an additional layer of information.
- **Sorting Options:** Sort the traffic lights based on values in ascending, descending, or series (none) order.
- **Orientation Flexibility:** Choose between a vertical or horizontal layout for the traffic lights.
- **Grid/Single Row Layout:** Ability to layout lights using an automatci grid or place all lights in a single row.

## Installation

This plugin can be installed using one of the following methods:

- [Grafana Plugins Catalog](https://grafana.com/docs/grafana/latest/administration/plugin-management/#install-a-plugin)
- Grafana CLI: `grafana-cli plugins install heywesty-trafficlight-panel`
- [Github releases page](https://github.com/jackw/heywesty-trafficlight-panel/releases)

## Usage

The traffic light panel uses the built in Grafana thresholds to assign lights to values.

1. **Define Thresholds:** In the plugin settings, define thresholds that categorize your data. A basic thresholds example for a traffic light looks like:

   ![thresholds example](https://raw.githubusercontent.com/jackw/heywesty-trafficlight-panel/main/docs/thresholds-example.png)

2. **Assign Colors:** Assign colors to each threshold range. These colors will be used to represent the corresponding data values in the traffic lights.
3. **Preview and Adjust:** After setting the thresholds, preview them on your dashboard. Adjust the thresholds and colors as necessary to accurately reflect the status indicated by your data.

> [!TIP]
> Make use of overrides if you'd like to set each traffic light to a different colour scheme.

## Options

Getting started is as simple as adding the panel to your dashboard and tweaking a few settings:

1. **Minimum Light Width:** Decide how big your traffic lights should be for clear visibility. The default setting is 100 pixels.
2. **Show Value:** Choose whether to display the numerical values with each light. True by default.
3. **Show Trend:** Add an extra layer of insight with a trend color. True by default.
4. **Sort Lights:** Organize your traffic lights in the order that makes sense to you:
   - None: Keep data series order.
   - Ascending: Line them up from lowest to highest values.
   - Descending: Line them up from highest to lowest values.
5. **Orientation:** Set the lights horizontally or stick to the default vertical layout.
6. **Single Row View:** By default each light will flow in an auto grid layout. This can be controlled by adjusting the minimum light width. Enable this if you'd prefer to keep all lights on one row.

## Troubleshooting / Help

### The query returned no data.

Check the datasource is returning data from the query.

### This data format is unsupported.

Right now the plugin support any data source that returns data frame(s) containing one numeric field.
