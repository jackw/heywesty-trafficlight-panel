import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { DataLinksContextMenu, useTheme2 } from '@grafana/ui';
import React from 'react';

import { DEFAULT_CUSTOM_COLORS, LAYOUT_MODES } from '../constants';
import { CustomColorOptions, LayoutMode, LightsDataValues, TrafficLightStyle } from '../types';
import { TrafficLightsComponentMap } from './TrafficLightStylesLazy';
import { TrafficLightValue } from './TrafficLightValue';

export function TrafficLight({
  light,
  style,
  showLegend,
  showValue,
  showTrend,
  horizontal,
  minLightWidth,
  layoutMode,
  customColors,
}: {
  light: LightsDataValues;
  style: TrafficLightStyle;
  showLegend: boolean;
  showValue: boolean;
  showTrend: boolean;
  horizontal: boolean;
  minLightWidth: number;
  layoutMode: LayoutMode;
  customColors?: CustomColorOptions;
}) {
  const Component = TrafficLightsComponentMap[style];
  const theme = useTheme2();
  const itemStyles = getStyles({ theme, minLightWidth, layoutMode });

  // Use custom colors if enabled, otherwise fall back to theme-based defaults
  const bgColor = getBackgroundColor(customColors, theme);
  const emptyColor = getEmptyLightColor(customColors, theme);

  return (
    <div key={light.title} className={itemStyles}>
      {light.hasLinks && light.getLinks !== undefined ? (
        <DataLinksContextMenu links={light.getLinks} style={{ flexGrow: 1 }}>
          {(api) => (
            <Component
              bgColor={bgColor}
              emptyColor={emptyColor}
              colors={light.colors}
              onClick={api.openMenu}
              horizontal={horizontal}
            />
          )}
        </DataLinksContextMenu>
      ) : (
        <Component bgColor={bgColor} emptyColor={emptyColor} colors={light.colors} horizontal={horizontal} />
      )}
      <TrafficLightValue
        showValue={showValue}
        showLegend={showLegend}
        showTrend={showTrend}
        light={light}
        theme={theme}
      />
    </div>
  );
}

function getBackgroundColor(customColors: CustomColorOptions | undefined, theme: GrafanaTheme2): string {
  if (customColors?.enabled) {
    const color = theme.isDark
      ? customColors.darkBackgroundColor ?? DEFAULT_CUSTOM_COLORS.darkBackground
      : customColors.lightBackgroundColor ?? DEFAULT_CUSTOM_COLORS.lightBackground;
    return theme.visualization.getColorByName(color);
  }
  return theme.isDark ? theme.colors.background.secondary : DEFAULT_CUSTOM_COLORS.lightBackground;
}

function getEmptyLightColor(customColors: CustomColorOptions | undefined, theme: GrafanaTheme2): string {
  if (customColors?.enabled) {
    const color = theme.isDark
      ? customColors.darkEmptyColor ?? DEFAULT_CUSTOM_COLORS.darkEmpty
      : customColors.lightEmptyColor ?? DEFAULT_CUSTOM_COLORS.lightEmpty;
    return theme.visualization.getColorByName(color);
  }
  return theme.isDark ? theme.colors.background.primary : DEFAULT_CUSTOM_COLORS.lightEmpty;
}

function getStyles({
  layoutMode,
  minLightWidth,
  theme,
}: {
  layoutMode: LayoutMode;
  minLightWidth: number;
  theme: GrafanaTheme2;
}) {
  if (layoutMode === LAYOUT_MODES.Row) {
    return css({
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: theme.spacing(),
      padding: theme.spacing(0.5),
      minWidth: minLightWidth,
    });
  }

  return css({
    display: 'grid',
    gridTemplateRows: '1fr max-content',
    gap: theme.spacing(),
    padding: theme.spacing(0.5),
  });
}
