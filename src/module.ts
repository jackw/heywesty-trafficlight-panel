import { PanelModel, PanelPlugin } from '@grafana/data';

import { TrafficLightPanel } from './components/TrafficLightPanel';
import { DEFAULT_CUSTOM_COLORS, LAYOUT_MODES, SORT_OPTIONS, TRAFFIC_LIGHT_STYLES } from './constants';
import { TrafficLightOptions } from './types';

export const plugin = new PanelPlugin<TrafficLightOptions>(TrafficLightPanel)
  .useFieldConfig()
  .setPanelOptions((builder) => {
    return builder
      .addNumberInput({
        path: 'minLightWidth',
        name: 'Minimum light width',
        description: 'Set the minimum traffic light width',
        defaultValue: 100,
      })
      .addRadio({
        path: 'layoutMode',
        name: 'Layout',
        description: 'Layout traffic lights in a grid, row, or marquee.',
        defaultValue: 'Grid',
        settings: {
          options: createOptions(LAYOUT_MODES),
        },
      })
      .addBooleanSwitch({
        path: 'reverseColors',
        name: 'Reverse light colors',
        description: 'Reverse the order of the light colors',
        defaultValue: false,
      })
      .addRadio({
        path: 'sortLights',
        name: 'Sort lights',
        description: 'Sort lights based on values',
        defaultValue: 'None',
        settings: {
          options: createOptions(SORT_OPTIONS),
        },
      })
      .addBooleanSwitch({
        path: 'showValue',
        name: 'Show value',
        description: 'Show or hide the value',
        defaultValue: true,
      })
      .addBooleanSwitch({
        path: 'showLegend',
        name: 'Show legend',
        description: 'Show or hide the legend (query name)',
        defaultValue: true,
      })
      .addBooleanSwitch({
        path: 'showTrend',
        name: 'Show trend',
        description: 'Show or hide the trend color',
        defaultValue: true,
      })
      .addSelect({
        path: 'style',
        name: 'Traffic light style',
        description: 'Choose the style for the traffic lights',
        defaultValue: 'default',
        settings: {
          options: createOptions(TRAFFIC_LIGHT_STYLES),
        },
      })
      .addBooleanSwitch({
        path: 'horizontal',
        name: 'Horizontal traffic lights',
        description: 'Change the orientation of the traffic lights',
        defaultValue: false,
      })
      .addBooleanSwitch({
        path: 'customColors.enabled',
        name: 'Custom colors',
        description: 'Enable custom background and empty light colors.',
        defaultValue: false,
      })
      .addColorPicker({
        path: 'customColors.darkBackgroundColor',
        name: 'Dark theme background',
        description: 'Traffic light background color for dark theme',
        showIf: (config) => config.customColors?.enabled,
      })
      .addColorPicker({
        path: 'customColors.darkEmptyColor',
        name: 'Dark theme empty lights',
        description: 'Empty light color for dark theme',
        showIf: (config) => config.customColors?.enabled,
      })
      .addColorPicker({
        path: 'customColors.lightBackgroundColor',
        name: 'Light theme background',
        description: 'Traffic light background color for light theme',
        showIf: (config) => config.customColors?.enabled,
      })
      .addColorPicker({
        path: 'customColors.lightEmptyColor',
        name: 'Light theme empty lights',
        description: 'Empty light color for light theme',
        showIf: (config) => config.customColors?.enabled,
      });
  })
  .setMigrationHandler(trafficLightMigrationHandler);

export function trafficLightMigrationHandler(panel: PanelModel<TrafficLightOptions>): Partial<TrafficLightOptions> {
  const options = { ...panel.options };

  if (options.singleRow) {
    options.layoutMode = LAYOUT_MODES.Row;
    delete options.singleRow;
  }

  // Clean up persisted default color values when custom colors are disabled
  if (options.customColors && !options.customColors.enabled) {
    options.customColors = { ...options.customColors };
    // Only remove values that match the default custom colors to avoid wiping user-configured colors
    if (options.customColors.darkBackgroundColor === DEFAULT_CUSTOM_COLORS.darkBackground) {
      delete options.customColors.darkBackgroundColor;
    }
    if (options.customColors.darkEmptyColor === DEFAULT_CUSTOM_COLORS.darkEmpty) {
      delete options.customColors.darkEmptyColor;
    }
    if (options.customColors.lightBackgroundColor === DEFAULT_CUSTOM_COLORS.lightBackground) {
      delete options.customColors.lightBackgroundColor;
    }
    if (options.customColors.lightEmptyColor === DEFAULT_CUSTOM_COLORS.lightEmpty) {
      delete options.customColors.lightEmptyColor;
    }
  }

  return options;
}

function createOptions(Obj: Record<string, string>): Array<{ value: string; label: string }> {
  return Object.values(Obj).map((value) => {
    const [first, ...rest] = value;
    return { value, label: `${first.toUpperCase()}${rest.join('')}` };
  });
}
