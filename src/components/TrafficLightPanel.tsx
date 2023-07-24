import React from 'react';
import { FieldConfigSource, GrafanaTheme2, PanelProps, getActiveThreshold } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css } from '@emotion/css';
import { useStyles2, useTheme2 } from '@grafana/ui';
// @ts-expect-error
import trend from 'basic-trend';

interface Props extends PanelProps<SimpleOptions> {}

const getStyles = (theme: GrafanaTheme2) => {
  return {
    grid: css`
      display: grid;
      gap: ${theme.spacing(2, 1)};
      align-content: top;
      justify-content: center;
      min-height: 100%;
      height: 100%;
      box-sizing: border-box;
    `,
    svg: css``,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
  };
};

const DEFAULT_THRESHOLDS = [
  {
    color: 'red',
    value: -Infinity,
  },
  {
    color: 'red',
    value: 0,
  },
  {
    color: '#EAB839',
    value: 50,
  },
  {
    color: '#73BF69',
    value: 80,
  },
];

function getThresholdSteps(fieldConfig: FieldConfigSource) {
  const hasThresholds = fieldConfig.defaults.thresholds?.steps && fieldConfig.defaults.thresholds.steps.length === 4;
  return hasThresholds ? fieldConfig.defaults.thresholds?.steps : DEFAULT_THRESHOLDS;
}

function getTrendColor(value: number) {
  switch (value) {
    case -1:
      return 'red';
    case 0:
      return 'transparent';
    default:
      return '#73BF69';
  }
}

export function TrafficLightPanel({ data, width, height, options, replaceVariables, fieldConfig, timeZone }: Props) {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);
  const thresholdSteps = getThresholdSteps(fieldConfig);
  const gridTemplateColumnsStyle = `repeat(${data.series.length}, 1fr)`;
  const lights = data.series.map((frame) => {
    const field = frame.fields[1];
    const trendValue = trend(field.values.toArray());
    const trendColor = getTrendColor(trendValue);
    const lastValue = field.display!(field.values.get(frame.length - 1));
    const activeThreshold = getActiveThreshold(lastValue.numeric, thresholdSteps);

    const colors = thresholdSteps?.slice(1).map((threshold, i) => {
      const isNegative = lastValue.numeric < 0 && i === 0;
      return {
        color: theme.visualization.getColorByName(threshold.color),
        active: isNegative ? true : threshold.value === activeThreshold.value,
      };
    });

    const seriesTrend = {
      color: theme.visualization.getColorByName(trendColor),
      value: trendValue,
    };

    return {
      name: field.name,
      value: lastValue,
      trend: seriesTrend,
      colors,
    };
  });

  const hasCorrectNumberOfThresholds = thresholdSteps?.slice(1).length === 3;

  if (hasCorrectNumberOfThresholds) {
    return (
      <div
        style={{
          width,
          height,
        }}
      >
        <div
          className={styles.grid}
          style={{
            gridTemplateColumns: gridTemplateColumnsStyle,
          }}
        >
          {lights.map((light) => (
            <div
              key={light.name}
              style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: theme.spacing() }}
            >
              <TrafficLight bgColor={theme.colors.background.secondary} colors={light.colors} />
              <div
                style={{
                  alignItems: 'center',
                  backgroundColor: `color-mix(in srgb, ${light.trend.color} 20%, ${theme.colors.background.primary})`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <span>{light.name}</span>
                <strong>
                  {light.value.prefix}
                  {light.value.text}
                  {light.value.suffix}
                </strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return <div>this is all sorts of wrong!</div>;
}

type TrafficLightProps = {
  colors: any;
  bgColor?: string;
  horizontal?: boolean;
};

function TrafficLight({ colors, bgColor = 'grey', horizontal = false }: TrafficLightProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox={horizontal ? '0 0 512 384' : '0 0 384 512'}
      style={{ display: 'block' }}
      height="100%"
      width="100%"
    >
      <g transform={horizontal ? 'rotate(-90 0 0)' : undefined} style={{ transformOrigin: '192px center' }}>
        <circle cx="192.5" cy="112.5" r="60.5" fill={colors[0].active ? colors[0].color : 'transparent'} />
        <circle cx="192.5" cy="241.5" r="60.5" fill={colors[1].active ? colors[1].color : 'transparent'} />
        <circle cx="192.5" cy="368.5" r="60.5" fill={colors[2].active ? colors[2].color : 'transparent'} />
        <path
          fill={bgColor}
          d="M320 32C320 14.38 305.62.9 288 .9H96C78.38.9 64 15.28 64 32c0 84.616 2.996 256 2.996 378.987 12.38 57.75 63.63 101 125 101s112.6-43.25 124.1-101C320 282.12 320 105.121 320 32ZM192 416c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48Zm0-128c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48Zm0-128c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48Z"
        />
      </g>
    </svg>
  );
}
