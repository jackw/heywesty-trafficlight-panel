---
title: Data formats
description: 'Learn what data formats the Traffic Light panel accepts.'
sidebar_position: 2
---

This document explains the data the Traffic Light panel needs from a query, so you can build a matching query or check your test data.

## Supported data shape

The panel accepts time series and table data. Every data frame the query returns must have at least one number field. If a frame has none, the panel shows **This data format is unsupported.**

The panel picks the shape for you. If any frame has a time field, it reads all frames as time series. Otherwise it reads the data as a table.

### Time series

Use a time series when you want one light for each series, such as one light for each host or service.

- Each frame has a time field and one or more number fields.
- Each number field becomes one light. The panel uses the last value of the field.
- The panel shows at most 25 lights.

#### Example

| time                | cpu_usage |
| ------------------- | --------- |
| 2026-10-23 10:00:00 | 42.1      |
| 2026-10-23 10:01:00 | 47.8      |
| 2026-10-23 10:02:00 | 55.3      |
| 2026-10-23 10:03:00 | 61.0      |

This frame produces one light with the value `61.0`. A query that returns ten series produces ten lights.

### Table

Use a table when each row is one item, such as one row for each storage service.

- The panel reads only the first frame.
- The frame has no time field, at least one number field and at least one string field.
- Each row becomes one light.

If the frame has a number field but no string field, the panel shows **The query returned no data.**

#### Example

| Name             | Value |
| ---------------- | ----- |
| Blob Storage     | 1     |
| Exported Storage | 4     |
| Hangfire         | 3     |
| Imported Storage | 5     |

This frame produces four lights, one for each row.

## Field mapping

The panel maps fields automatically. There are no field pickers in the panel editor.

| Shape       | Light value                        | Legend                               | Trend                                                     |
| ----------- | ---------------------------------- | ------------------------------------ | --------------------------------------------------------- |
| Time series | The last value of the number field | The display name of the number field | Computed from the values of the second field in the frame |
| Table       | The first number field in the row  | The first string field in the row    | Not available                                             |

The trend compares each value in the series with the value before it. If most values go up, the trend color is green. If most values go down, the trend color is red. Otherwise the panel shows no trend color.

The light's color comes from the thresholds of the number field. For how the panel maps a value to a light, refer to [Configure thresholds](./options.md#configure-thresholds).

### When the query returns no data

If the query returns no data frames, the panel shows **The query returned no data.** If you set **No value** in the **Standard options** to a number, the panel shows one light for that number instead.

## Check what your query returns

To see the data the panel receives, open the panel editor, click **Query inspector** and select the **Data** tab. You can also turn on **Table view** at the top of the panel editor to see the data as a table.

## Reshape data that doesn't match

<!-- snippet:reshape-with-transformations -->

If a query returns data in a different shape, you can reshape it without changing the query. Select the **Transform data** tab in the panel editor and add a transformation. For more information, refer to [Transform data](https://grafana.com/docs/grafana/latest/panels-visualizations/query-transform-data/transform-data/).

<!-- /snippet:reshape-with-transformations -->
