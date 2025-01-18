import { GrafanaTheme2 } from '@grafana/data';
import React from 'react';
import { LightsDataValues } from 'types';

import { TEST_IDS } from '../constants';

interface TrafficLightValueProps {
  showValue: boolean;
  showLegend: boolean;
  showTrend: boolean;
  light: LightsDataValues;
  theme: GrafanaTheme2;
}

export function TrafficLightValue({ showValue, showLegend, showTrend, light, theme }: TrafficLightValueProps) {
  if (!showValue && !showLegend && !showTrend) {
    return null;
  }

  return (
    <div
      data-testid={TEST_IDS.trafficLightValueContainer}
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
      {showLegend && <span data-testid={TEST_IDS.trafficLightLegend}>{light.title}</span>}
      {showValue && (
        <strong data-testid={TEST_IDS.trafficLightValue}>
          {light.prefix}
          {light.value}
          {light.suffix}
        </strong>
      )}
    </div>
  );
}
