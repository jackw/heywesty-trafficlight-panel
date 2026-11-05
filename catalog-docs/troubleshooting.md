---
title: Troubleshooting
description: 'Fix common Traffic Light panel problems, such as invalid thresholds, empty panels, no data, unsupported data formats, and lights that do not turn on.'
sidebar_position: 5
---

This page explains how to fix common issues when you use the Traffic Light panel. For the data the panel expects, refer to [Data formats](./data-formats.md).

## Panel shows "Invalid thresholds"

The panel shows an **Invalid thresholds** message that asks you to configure thresholds for all three lights. The message marks each of the three lights as **Threshold configured** or **Threshold not configured**.

The thresholds of the field have fewer than three steps. A new panel has only two steps by default.

To fix this, find the **Thresholds** section in the panel editor and click **Add threshold** until there are at least three steps. If you use threshold overrides, each override also needs at least three steps. For more information, refer to [Configure thresholds](./options.md#configure-thresholds).

## Panel is empty with the Dynamic style

The panel shows nothing, with no lights and no message, when **Traffic light style** is **Dynamic**.

The thresholds have fewer than three steps. The **Dynamic** style needs at least three steps, like the other styles, but doesn't show the **Invalid thresholds** message.

To fix this, add threshold steps until there are at least three, as described in [Panel shows "Invalid thresholds"](#panel-shows-invalid-thresholds).

## Panel shows "The query returned no data"

The panel shows **The query returned no data.** instead of the lights.

The likely causes are:

- The query returns no data frames. Check that the data source returns data for the query and the time range.
- The query returns a table with no rows.
- The query returns table data with a number field but no string field. The panel needs a string field to name each light. Add a string column to the query, or use a transformation to add one.

To show a traffic light when there is no data, set **No value** in the **Standard options** to a number, such as `0`. The panel then shows one traffic light for that number. If **No value** isn't a number, the panel ignores it. The thresholds still need at least three steps.

## Panel shows "This data format is unsupported"

The panel shows **This data format is unsupported.** instead of the lights.

At least one data frame from the query has no number field. Each frame needs a number field for the light value. Change the query to return numbers, or use a transformation to convert the field to a number. For the shapes the panel accepts, refer to [Data formats](./data-formats.md).

## No light turns on

The traffic light shows, but none of its lights turns on.

With the **Default**, **Rounded**, and **Sidelights** styles, the panel uses only the first three threshold steps. If the value falls in a fourth or later step, no light turns on. Remove the extra steps, or use the **Dynamic** style to show one light for each step.

## Get more detail about an error

To see the data the panel receives, open the panel editor, click **Query inspector** and select the **Data** tab.

For errors in the panel itself, open the developer tools in your browser and check the console.

## Get additional help

If this page doesn't solve your problem:

- Search the [Grafana community forums](https://community.grafana.com/).
- If your Grafana Cloud or Grafana Enterprise plan includes support, contact Grafana Support.
- Search or open an issue in the [Traffic Light issue tracker](https://github.com/jackw/heywesty-trafficlight-panel/issues).

When you report an issue, include:

- The Grafana and plugin versions
- The error message, with sensitive information removed
- The steps to reproduce the issue
- The panel options and a sample of the data it shows, with sensitive information removed
