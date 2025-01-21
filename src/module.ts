import { PanelModel, PanelPlugin } from '@grafana/data';

import { TrafficLightPanel } from './components/TrafficLightPanel';
import { LAYOUT_MODES, SORT_OPTIONS, TRAFFIC_LIGHT_STYLES } from './constants';
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
      });
  })
  .setMigrationHandler(trafficLightMigrationHandler);

function trafficLightMigrationHandler(panel: PanelModel<TrafficLightOptions>): Partial<TrafficLightOptions> {
  if (panel.options.singleRow) {
    panel.options.layoutMode = LAYOUT_MODES.Row;
    delete panel.options.singleRow;
  }
  return panel.options;
}

function createOptions(Obj: Record<string, string>): Array<{ value: string; label: string }> {
  return Object.values(Obj).map((value) => {
    const [first, ...rest] = value;
    return { value, label: `${first.toUpperCase()}${rest.join('')}` };
  });
}

console.log(1);

if (module.hot) {
  console.log('🔥 HMR is enabled for plugin!');
  console.log('📌 Webpack HMR Status:', module.hot.status());
  module.hot.accept((err) => {
    console.log('🔄 Plugin updated via HMR!');
    if (err) {
      console.error('HMR Accept Error:', err);
    }
  });

  module.hot.addStatusHandler((status) => {
    if (status === 'apply') {
      console.log('🔁 Applying HMR update...');
      fetch('http://localhost:5173/__plugin_reload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'cors',
        body: JSON.stringify({
          file: 'http://localhost:8080/heywesty-trafficlight-panel/0.5.2/public/plugins/heywesty-trafficlight-panel/module.js',
        }),
      });
    }
  });

  module.hot.dispose(() => {
    console.log('♻️ Cleaning up before applying HMR update...');
  });
}
