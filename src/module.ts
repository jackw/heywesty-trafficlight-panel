import { PanelPlugin } from '@grafana/data';
import { SortOptions, TrafficLightOptions } from './types';
import { TrafficLightPanel } from './components/TrafficLightPanel';

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
    .addBooleanSwitch({
      path: 'singleRow',
      name: 'Single row',
      description: 'Place all lights in a single row',
      defaultValue: false,
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
