import { PanelModel } from '@grafana/data';

import { DEFAULT_CUSTOM_COLORS, LAYOUT_MODES } from './constants';
import { trafficLightMigrationHandler } from './module';
import { TrafficLightOptions } from './types';

function makePanel(options: Partial<TrafficLightOptions> & Record<string, unknown>): PanelModel<TrafficLightOptions> {
  return { options } as unknown as PanelModel<TrafficLightOptions>;
}

describe('trafficLightMigrationHandler', () => {
  describe('singleRow migration', () => {
    it('converts singleRow:true to layoutMode Row and removes singleRow', () => {
      const panel = makePanel({ singleRow: true });
      const result = trafficLightMigrationHandler(panel);
      expect(result.layoutMode).toBe(LAYOUT_MODES.Row);
      expect('singleRow' in result).toBe(false);
    });

    it('leaves layoutMode unchanged when singleRow is absent', () => {
      const panel = makePanel({ layoutMode: LAYOUT_MODES.Grid });
      const result = trafficLightMigrationHandler(panel);
      expect(result.layoutMode).toBe(LAYOUT_MODES.Grid);
      expect('singleRow' in result).toBe(false);
    });

    it('does not mutate the original panel options', () => {
      const options = { singleRow: true };
      const panel = makePanel(options);
      trafficLightMigrationHandler(panel);
      expect((options as Record<string, unknown>).singleRow).toBe(true);
    });
  });

  describe('customColors cleanup', () => {
    it('strips persisted default color fields when customColors is disabled', () => {
      const panel = makePanel({
        customColors: {
          enabled: false,
          darkBackgroundColor: DEFAULT_CUSTOM_COLORS.darkBackground,
          darkEmptyColor: DEFAULT_CUSTOM_COLORS.darkEmpty,
          lightBackgroundColor: DEFAULT_CUSTOM_COLORS.lightBackground,
          lightEmptyColor: DEFAULT_CUSTOM_COLORS.lightEmpty,
        },
      });

      const result = trafficLightMigrationHandler(panel);

      expect(result.customColors).toEqual({ enabled: false });
    });

    it('preserves non-default color values when customColors is disabled', () => {
      const panel = makePanel({
        customColors: {
          enabled: false,
          darkBackgroundColor: '#ff0000',
          lightBackgroundColor: '#00ff00',
        },
      });

      const result = trafficLightMigrationHandler(panel);

      expect(result.customColors).toEqual({
        enabled: false,
        darkBackgroundColor: '#ff0000',
        lightBackgroundColor: '#00ff00',
      });
    });

    it('preserves color values when customColors is enabled', () => {
      const panel = makePanel({
        customColors: {
          enabled: true,
          darkBackgroundColor: '#ff0000',
          darkEmptyColor: DEFAULT_CUSTOM_COLORS.darkEmpty,
        },
      });

      const result = trafficLightMigrationHandler(panel);

      expect(result.customColors?.darkBackgroundColor).toBe('#ff0000');
      expect(result.customColors?.darkEmptyColor).toBe(DEFAULT_CUSTOM_COLORS.darkEmpty);
    });

    it('does not modify options when customColors is absent', () => {
      const panel = makePanel({ layoutMode: LAYOUT_MODES.Grid });
      const result = trafficLightMigrationHandler(panel);
      expect(result.customColors).toBeUndefined();
    });
  });
});
