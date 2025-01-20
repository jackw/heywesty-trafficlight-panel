import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';
import { DataLinksContextMenu, useTheme2 } from '@grafana/ui';
import React from 'react';

import { LAYOUT_MODES } from '../constants';
import { LayoutMode, LightsDataValues, TrafficLightStyle } from '../types';
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
}: {
  light: LightsDataValues;
  style: TrafficLightStyle;
  showLegend: boolean;
  showValue: boolean;
  showTrend: boolean;
  horizontal: boolean;
  minLightWidth: number;
  layoutMode: LayoutMode;
}) {
  const Component = TrafficLightsComponentMap[style];
  const theme = useTheme2();
  const itemStyles = getStyles({ theme, minLightWidth, layoutMode });
  const bgColor = theme.isDark ? theme.colors.background.secondary : '#C5C5C8';
  const emptyColor = theme.isDark ? theme.colors.background.primary : '#AAAAAF';
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

function getStyles({
  layoutMode,
  minLightWidth,
  theme,
}: {
  layoutMode: LayoutMode;
  minLightWidth: number;
  theme: GrafanaTheme2;
}) {
  if (layoutMode === LAYOUT_MODES.Grid) {
    return css({
      display: 'grid',
      gridTemplateRows: '1fr max-content',
      gap: theme.spacing(),
      padding: theme.spacing(0.5),
    });
  }

  return css({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: theme.spacing(),
    padding: theme.spacing(0.5),
    minWidth: minLightWidth,
  });
}
