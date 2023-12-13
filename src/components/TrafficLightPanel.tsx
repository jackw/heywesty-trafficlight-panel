import React from 'react';
import { PanelProps } from '@grafana/data';

import { TrafficLightOptions } from 'types';
import { DataLinksContextMenu, useTheme2 } from '@grafana/ui';

import { LightsDataResultStatus, useLightsData } from 'hooks/useLightsData';
import { calculateRowsAndColumns } from 'utils';
import { TrafficLight } from './TrafficLight';

interface Props extends PanelProps<TrafficLightOptions> {}

export function TrafficLightPanel({ data, width, height, options, replaceVariables, fieldConfig, timeZone }: Props) {
  const { minLightWidth, sortLights, showValue, showTrend } = options;
  const theme = useTheme2();
  const { rows, cols } = calculateRowsAndColumns(width, minLightWidth, data.series.length);
  const gridTemplateColumnsStyle = `repeat(${cols}, minmax(75px, 1fr)`;
  const gridTemplateRowsStyle = `repeat(${rows},  ${100 / rows}%)`;

  const { values, status } = useLightsData({
    fieldConfig,
    replaceVariables,
    theme,
    data: data.series,
    timeZone,
    sortLights,
  });

  if (status === LightsDataResultStatus.nodata || status === LightsDataResultStatus.unsupported) {
    return <div>Please check the data.</div>;
  }

  return (
    <div
      style={{
        width,
        height,
      }}
    >
      <div
        style={{
          display: 'grid',
          alignContent: 'top',
          gridTemplateColumns: gridTemplateColumnsStyle,
          gridTemplateRows: gridTemplateRowsStyle,
          justifyContent: 'center',
          minHeight: '100%',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        {values.map((light) => (
          <div
            key={light.title}
            style={{
              display: 'grid',
              gridTemplateRows: '1fr max-content',
              gap: theme.spacing(),
              padding: theme.spacing(0.5),
            }}
          >
            {light.hasLinks && light.getLinks !== undefined ? (
              <DataLinksContextMenu links={light.getLinks} style={{ flexGrow: 1 }}>
                {(api) => (
                  <TrafficLight
                    bgColor={theme.isDark ? theme.colors.background.secondary : theme.colors.secondary.shade}
                    colors={light.colors}
                    onClick={api.openMenu}
                    horizontal={options.horizontal}
                  />
                )}
              </DataLinksContextMenu>
            ) : (
              <TrafficLight
                bgColor={theme.isDark ? theme.colors.background.secondary : theme.colors.secondary.shade}
                colors={light.colors}
                horizontal={options.horizontal}
              />
            )}
            {showValue && (
              <div
                style={{
                  alignItems: 'center',
                  backgroundColor: showTrend
                    ? `color-mix(in srgb, ${light.trend.color} 20%, ${theme.colors.background.primary})`
                    : 'transparent',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <span>{light.title}</span>
                <strong>
                  {light.prefix}
                  {light.value}
                  {light.suffix}
                </strong>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
