import { GrafanaTheme2 } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import React from 'react';
import { DEFAULT_CUSTOM_COLORS, TEST_IDS } from '../constants';
import { CustomColorOptions, LightsDataValues } from '../types';
import { clamp } from '../utils/utils';

interface TrafficLightStackLightProps {
  values: LightsDataValues[];
  customColors?: CustomColorOptions;
  horizontal?: boolean;
}

export default function TrafficLightStackLight({
  values,
  customColors,
  horizontal = false,
}: TrafficLightStackLightProps) {
  const theme = useTheme2();
  const bgColor = getBackgroundColor(customColors, theme);
  const emptyColor = getEmptyLightColor(customColors, theme);

  const totalAvailableHeight = 406;
  const minGap = 4;
  const maxGap = 24;
  const numberOfSegments = values.length;
  const x = 52;
  const segmentWidth = 168;
  const { height, yPosition } = calculateSegmentPositions(totalAvailableHeight, minGap, maxGap, numberOfSegments);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox={horizontal ? '0 0 512 272' : '0 0 272 512'}
      style={{ height: '100%', width: '100%' }}
      data-testid={TEST_IDS.styleStackLight}
    >
      <g transform={horizontal ? 'rotate(-90 0 0)' : undefined} style={{ transformOrigin: '25% center' }}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M46 13C34.9543 13 26 21.9543 26 33V479.095C26 490.141 34.9543 499.095 46 499.095H226C237.046 499.095 246 490.141 246 479.095V33C246 21.9543 237.046 13 226 13H46Z"
          fill={bgColor}
        />

        {values.map((value, index) => {
          const segmentColor = value.colors.find((c) => c.active)?.color ?? emptyColor;

          return (
            <g key={index}>
              <rect
                x={x}
                y={yPosition[index]}
                width={segmentWidth}
                height={height}
                rx="8"
                fill={segmentColor}
                style={{ filter: `drop-shadow(0 0 16px ${segmentColor})` }}
              />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

function calculateSegmentPositions(
  totalHeight: number,
  minGap: number,
  maxGap: number,
  numberOfSegments: number,
  startOffset = 57
) {
  const numGaps = numberOfSegments - 1;
  const initialGapSize = maxGap / (numberOfSegments * 0.5);
  const gapSize = clamp(initialGapSize, minGap, maxGap);
  const totalGapHeight = gapSize * numGaps;
  const remainingHeightForSegments = totalHeight - totalGapHeight;
  const segmentHeight = remainingHeightForSegments / numberOfSegments;

  let currentYPosition = startOffset;
  const yPositions: number[] = [];

  for (let i = 0; i < numberOfSegments; i++) {
    yPositions.push(currentYPosition);
    currentYPosition += segmentHeight + gapSize;
  }

  return {
    height: segmentHeight,
    yPosition: yPositions,
  };
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
