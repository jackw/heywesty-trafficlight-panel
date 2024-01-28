import React from 'react';
import { GrafanaTheme2, PanelProps } from '@grafana/data';

import { TrafficLightOptions } from 'types';
import { DataLinksContextMenu, useTheme2 } from '@grafana/ui';

import { LightsDataResultStatus, useLightsData } from 'hooks/useLightsData';
import { calculateRowsAndColumns } from 'utils';
import { TrafficLight } from './TrafficLight';

interface TrafficLightPanelProps extends PanelProps<TrafficLightOptions> {}

export function TrafficLightPanel({
  data,
  width,
  height,
  options,
  replaceVariables,
  fieldConfig,
  timeZone,
}: TrafficLightPanelProps) {
  const { minLightWidth, sortLights, showValue, showTrend, singleRow } = options;
  const theme = useTheme2();
  const { rows, cols } = calculateRowsAndColumns(width, minLightWidth, data.series.length);
  const styles = getStyles({ rows, cols, singleRow, minLightWidth, theme });
  const { values, status } = useLightsData({
    fieldConfig,
    replaceVariables,
    theme,
    data: data.series,
    timeZone,
    sortLights,
  });

  if (status === LightsDataResultStatus.nodata) {
    return (
      <div style={styles.centeredContent}>
        <h4>The query returned no data.</h4>
      </div>
    );
  }

  if (status === LightsDataResultStatus.unsupported) {
    return (
      <div style={styles.centeredContent}>
        <h4>This data format is unsupported.</h4>
      </div>
    );
  }

  if (status === LightsDataResultStatus.incorrectThresholds) {
    return (
      <div style={styles.centeredContent}>
        <h4>Thresholds are incorrectly set.</h4>
      </div>
    );
  }

  return (
    <div
      style={{
        width,
        height,
      }}
    >
      {/* @ts-ignore TODO: fix up styles. */}
      <div style={styles.containerStyle}>
        {values.map((light) => (
          // @ts-ignore TODO: fix up styles.
          <div key={light.title} style={styles.itemStyle}>
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

function getStyles({
  rows,
  cols,
  singleRow,
  minLightWidth,
  theme,
}: {
  rows: number;
  cols: number;
  singleRow: boolean;
  minLightWidth: number;
  theme: GrafanaTheme2;
}) {
  const gridContainerStyle = {
    display: 'grid',
    alignContent: 'top',
    gridTemplateColumns: `repeat(${cols}, minmax(${minLightWidth}px, 1fr)`,
    gridTemplateRows: `repeat(${rows},  ${100 / rows}%)`,
    justifyContent: 'center',
    minHeight: '100%',
    height: '100%',
    boxSizing: 'border-box',
  };
  const flexContainerStyle = {
    display: 'flex',
    height: '100%',
    minHeight: '100%',
    overflowX: 'auto',
  };
  const gridItemStyle = {
    display: 'grid',
    gridTemplateRows: '1fr max-content',
    gap: theme.spacing(),
    padding: theme.spacing(0.5),
  };
  const flexItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: theme.spacing(),
    padding: theme.spacing(0.5),
    minWidth: minLightWidth,
  };
  const centeredContent = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  return {
    containerStyle: singleRow ? flexContainerStyle : gridContainerStyle,
    itemStyle: singleRow ? flexItemStyle : gridItemStyle,
    centeredContent,
  };
}
