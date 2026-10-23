---
title: Options
description: 'Reference for the Traffic Light panel options, including layout, sorting, styles, custom colors, standard field options, and how threshold steps map to lights.'
sidebar_position: 3
---

To change these options, open the panel editor and use the options pane. The panel adds its own options in the **Traffic Light** section and uses the standard field options, including thresholds, to color the lights.

## Panel options

| Option                    | Type         | Default                             | Description                                     |
| ------------------------- | ------------ | ----------------------------------- | ----------------------------------------------- |
| Minimum light width       | Number       | `100`                               | Set the minimum traffic light width             |
| Layout                    | Radio        | Grid                                | Lay out traffic lights in a grid or a row       |
| Reverse light colors      | Toggle       | Off                                 | Reverse the order of the light colors           |
| Sort lights               | Radio        | Not set (sorts in descending order) | Sort lights based on values                     |
| Show value                | Toggle       | On                                  | Show or hide the value                          |
| Show legend               | Toggle       | On                                  | Show or hide the legend (series or row name)    |
| Show trend                | Toggle       | On                                  | Show or hide the trend color                    |
| Traffic light style       | Select       | Default                             | Choose the style for the traffic lights         |
| Horizontal traffic lights | Toggle       | Off                                 | Change the orientation of the traffic lights    |
| Custom colors             | Toggle       | Off                                 | Enable custom background and empty light colors |
| Dark theme background     | Color picker | Empty (`#2d3640`)                   | Traffic light background color for dark theme   |
| Dark theme empty lights   | Color picker | Empty (`#1e2229`)                   | Empty light color for dark theme                |
| Light theme background    | Color picker | Empty (`#c5c5c8`)                   | Traffic light background color for light theme  |
| Light theme empty lights  | Color picker | Empty (`#aaaaaf`)                   | Empty light color for light theme               |

The four color pickers appear only when **Custom colors** is on. Each one applies to the matching Grafana theme. If you leave a picker empty, the panel uses the color in brackets. When **Custom colors** is off, the panel uses the colors of the current Grafana theme.

### Layout

- **Grid** places the traffic lights in a grid. The panel works out how many rows it needs so that each traffic light is at least **Minimum light width** wide, then spreads the traffic lights evenly across the rows. The rows share the height of the panel.
- **Row** places all traffic lights in one row. If they don't fit, the row scrolls horizontally.

### Sort lights

- **None** keeps the order of the series or table rows.
- **Ascending** orders lights from the lowest value to the highest.
- **Descending** orders lights from the highest value to the lowest.

On a new panel, no option is selected and the panel sorts lights in descending order. To keep the original order, select **None**.

### Traffic light style

![Traffic lights in the Default, Rounded, Sidelights and Dynamic styles](./img/traffic-lights.png)

- **Default**, **Rounded**, and **Sidelights** draw a traffic light with three lights.
- **Dynamic** draws one light for each threshold step, so you can use more than three lights.

### Value, legend, and trend

Below each light, the panel shows the legend and the value. **Show legend** shows the display name of the series, or the string value of the table row. **Show trend** colors the background of this area green when the values go up and red when they go down. Table data has no trend. For how the panel computes the trend, refer to [Field mapping](./data-formats.md#field-mapping).

## Standard field options

For what each standard option does, refer to [Configure standard options](https://grafana.com/docs/grafana/latest/panels-visualizations/configure-standard-options/).

The panel supports all standard options:

- Unit
- Min
- Max
- Decimals
- Display name
- Color scheme
- No value
- Value mappings
- Thresholds
- Data links

If you add data links, click a traffic light to use them. With one link, the click opens the link. With more than one, the click opens a menu with the links. For more information, refer to [Configure data links](https://grafana.com/docs/grafana/latest/panels-visualizations/configure-data-links/).

## Configure thresholds

The panel uses thresholds to decide which light turns on. Each threshold step is one light, and its color is the color of that light.

![The Thresholds section of the panel editor with a red base step, an orange step at 33 and a green step at 66](./img/thresholds-example.png)

To set up the thresholds:

1. In the panel editor, find the **Thresholds** section.
1. Click **Add threshold** until there are at least three steps, including **Base**.
1. Set a color for each step.

Every field needs at least three steps, including fields that use a threshold override. If any field has fewer than three steps, the **Default**, **Rounded**, and **Sidelights** styles show an **Invalid thresholds** message instead of the lights. The **Dynamic** style shows nothing.

The panel compares the value with the step values directly, so **Percentage** mode works the same way as **Absolute** mode.

### How steps map to lights

- **Default**, **Rounded**, and **Sidelights** use the first three steps. **Base** is the top light, the second step is the middle light and the third step is the bottom light. If the value falls in a fourth or later step, none of the lights turns on.
- **Dynamic** draws one light for each step, with **Base** at the top.

Grafana sorts threshold steps from lowest to highest. If the highest step means "stop" and the base step means "go", turn on **Reverse light colors** to reverse the order of the lights.

> [!TIP]
> To give some lights a different color scheme, add a field override that sets **Thresholds** for those fields. With the **Dynamic** style, overrides can also give each light a different number of steps. For an example, refer to [Threshold overrides](./examples.md#threshold-overrides).
