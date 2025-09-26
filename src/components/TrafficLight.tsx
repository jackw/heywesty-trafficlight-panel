import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { DataLinksContextMenu, useTheme2 } from '@grafana/ui';
import React from 'react';

import { LAYOUT_MODES } from '../constants';
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
    return theme.isDark
      ? theme.visualization.getColorByName(customColors.darkBackgroundColor)
      : theme.visualization.getColorByName(customColors.lightBackgroundColor);
  }
  return theme.isDark ? theme.colors.background.secondary : '#C5C5C8';
}

function getEmptyLightColor(customColors: CustomColorOptions | undefined, theme: GrafanaTheme2): string {
  if (customColors?.enabled) {
    return theme.isDark
      ? theme.visualization.getColorByName(customColors.darkEmptyColor)
      : theme.visualization.getColorByName(customColors.lightEmptyColor);
  }
  return theme.isDark ? theme.colors.background.primary : '#AAAAAF';
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
