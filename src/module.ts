import { FieldConfigProperty, PanelPlugin, ThresholdsMode } from '@grafana/data';
import { SortOptions, TrafficLightOptions } from './types';
import { TrafficLightPanel } from './components/TrafficLightPanel';

export const plugin = new PanelPlugin<TrafficLightOptions>(TrafficLightPanel)
  .useFieldConfig({
    standardOptions: {
      [FieldConfigProperty.Thresholds]: {
        defaultValue: {
          mode: ThresholdsMode.Percentage,
          steps: [
            { color: 'red', value: -Infinity },
            { color: 'red', value: 0 },
            { color: '#EAB839', value: 50 },
            { color: '#73BF69', value: 80 },
          ],
        },
      },
    },
  })
  .setPanelOptions((builder) => {
    return builder
      .addNumberInput({
        path: 'minLightWidth',
        name: 'Minimum light width',
        description: 'Set the minimum traffic light width',
        defaultValue: 75,
      })
      .addRadio({
        path: 'sortLights',
        name: 'Sort lights',
        description: 'Sort lights based on values',
        defaultValue: SortOptions.None,
        settings: {
          options: [
            { value: SortOptions.None, label: 'None' },
            { value: SortOptions.Asc, label: 'Ascending' },
            { value: SortOptions.Desc, label: 'Descending' },
          ],
        },
      })
      .addBooleanSwitch({
        path: 'showValue',
        name: 'Show value',
        description: 'Show or hide the value',
        defaultValue: true,
      })
      .addBooleanSwitch({
        path: 'showTrend',
        name: 'Show trend',
        description: 'Show or hide the trend color',
        defaultValue: true,
      })
      .addBooleanSwitch({
        path: 'horizontal',
        name: 'Horizontal traffic lights',
        description: 'Change the orientation of the traffic lights',
        defaultValue: false,
      });
  });
