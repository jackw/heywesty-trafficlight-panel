import React from 'react';
import { GrafanaTheme2, PanelProps } from '@grafana/data';

import { TrafficLightOptions } from 'types';
import { DataLinksContextMenu, useTheme2 } from '@grafana/ui';

import { LightsDataResultStatus, LightsDataValues, useLightsData } from 'hooks/useLightsData';
import { calculateRowsAndColumns } from 'utils/utils';
import { TrafficLightRounded } from './TrafficLightRounded';
import { TrafficLightDefault } from './TrafficLightDefault';
import { TrafficLightSideLights } from './TrafficLightSideLights';
import { ThresholdsAssistant } from './ThresholdsAssistant';

interface TrafficLightPanelProps extends PanelProps<TrafficLightOptions> {}

const TrafficLightsComponentMap = {
  default: TrafficLightDefault,
  rounded: TrafficLightRounded,
  sidelights: TrafficLightSideLights,
};

export function TrafficLightPanel({
  data,
  width,
  height,
  options,
  replaceVariables,
  fieldConfig,
  timeZone,
}: TrafficLightPanelProps) {
  const { minLightWidth, sortLights, showLegend, showValue, showTrend, singleRow, style, reverseColors } = options;
  const theme = useTheme2();
  const { values, status, invalidThresholds } = useLightsData({
    fieldConfig,
    replaceVariables,
    theme,
    data: data.series,
    timeZone,
    sortLights,
    reverseColors,
  });
  const Component = TrafficLightsComponentMap[style];
  const { rows, cols } = calculateRowsAndColumns(width, minLightWidth, values.length);
  const styles = getStyles({ rows, cols, singleRow, minLightWidth, theme });

  if (status === LightsDataResultStatus.nodata) {
    return (
      <div data-testid="feedback-message-container" style={styles.centeredContent}>
        <h4>The query returned no data.</h4>
      </div>
    );
  }

  if (status === LightsDataResultStatus.unsupported) {
    return (
      <div data-testid="feedback-message-container" style={styles.centeredContent}>
        <h4>This data format is unsupported.</h4>
      </div>
    );
  }

  if (status === LightsDataResultStatus.incorrectThresholds) {
    return (
      <div style={styles.centeredContent}>
        <ThresholdsAssistant thresholds={invalidThresholds} />
      </div>
    );
  }

  return (
    <div
      style={{
        width,
        height,
      }}
      data-testid="heywesty-traffic-light"
    >
      {/* @ts-ignore TODO: fix conditional styles errors. */}
      <div style={styles.containerStyle}>
        {values.map((light) => (
          // @ts-ignore TODO: fix conditional styles errors.
          <div key={light.title} style={styles.itemStyle}>
            {light.hasLinks && light.getLinks !== undefined ? (
              <DataLinksContextMenu links={light.getLinks} style={{ flexGrow: 1 }}>
                {(api) => (
                  <Component
                    bgColor={theme.isDark ? theme.colors.background.secondary : '#C5C5C8'}
                    emptyColor={theme.isDark ? theme.colors.background.primary : '#AAAAAF'}
                    colors={light.colors}
                    onClick={api.openMenu}
                    horizontal={options.horizontal}
                  />
                )}
              </DataLinksContextMenu>
            ) : (
              <Component
                bgColor={theme.isDark ? theme.colors.background.secondary : '#C5C5C8'}
                emptyColor={theme.isDark ? theme.colors.background.primary : '#AAAAAF'}
                colors={light.colors}
                horizontal={options.horizontal}
              />
            )}
            <TrafficLightValue
              showValue={showValue}
              showLegend={showLegend}
              showTrend={showTrend}
              light={light}
              theme={theme}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

interface TrafficLightValueProps {
  showValue: boolean;
  showLegend: boolean;
  showTrend: boolean;
  light: LightsDataValues;
  theme: GrafanaTheme2;
}

function TrafficLightValue({ showValue, showLegend, showTrend, light, theme }: TrafficLightValueProps) {
  return (
    <div
      style={{
        alignItems: 'center',
        backgroundColor: showTrend
          ? `color-mix(in srgb, ${light.trend.color} 20%, ${theme.colors.background.primary})`
          : 'transparent',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: theme.spacing(0.25),
      }}
    >
      {showLegend && <span>{light.title}</span>}
      {showValue && (
        <strong>
          {light.prefix}
          {light.value}
          {light.suffix}
        </strong>
      )}
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
