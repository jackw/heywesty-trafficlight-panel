import { DataFrame, FieldType, getActiveThreshold, ThresholdsConfig } from '@grafana/data';

import { LightsDataValues, SortOptions } from '../types';

export function basicTrend(data?: number[]) {
  const diff: {
    increasing: number[];
    decreasing: number[];
    equals: number[];
  } = {
    increasing: [],
    decreasing: [],
    equals: [],
  };
  if (data === undefined) {
    return 0;
  }

  data.map(function (item, index, array) {
    if (index > 0) {
      const difference = item - array[index - 1];
      if (difference === 0) {
        diff.equals.push(difference);
      } else if (difference > 0) {
        diff.increasing.push(difference);
      } else {
        diff.decreasing.push(difference);
      }
    }
    return item;
  });

  const increasingLength = diff.increasing.length;
  const decreasingLength = diff.decreasing.length;
  const equalsLength = diff.equals.length;

  if (increasingLength > decreasingLength + equalsLength) {
    return 1;
  }
  if (decreasingLength > increasingLength + equalsLength) {
    return -1;
  }
  if (equalsLength > increasingLength + decreasingLength) {
    return 0;
  }
  return 0;
}

export function calculateRowsAndColumns(containerWidth: number, itemWidth: number, itemCount: number) {
  if (itemCount === 0) {
    return { rows: 0, cols: 0 };
  }
  if (containerWidth < itemWidth) {
    return { rows: 1, cols: itemCount };
  }

  const itemsPerRow = Math.floor(containerWidth / itemWidth);
  const rows = Math.ceil(itemCount / itemsPerRow);
  const cols = Math.ceil(itemCount / rows);

  return { rows, cols };
}

export function sortByValue(arr: LightsDataValues[], sortOrder: SortOptions): LightsDataValues[] {
  return arr.sort((a, b) => {
    if (sortOrder === SortOptions.Asc) {
      return a.numericValue - b.numericValue;
    } else {
      return b.numericValue - a.numericValue;
    }
  });
}

export function isSupported(data?: DataFrame[]): boolean {
  if (!data || data.length === 0) {
    return false;
  }

  return data.every((d) => {
    const field = d.fields.find((f) => {
      return f.type === FieldType.number;
    });

    return Boolean(field);
  });
}

export function isTimeSeries(data?: DataFrame[]): boolean {
  return Boolean(data?.some((d) => d.fields.some((f) => f.type === FieldType.time)));
}

export function noData(data?: DataFrame[]): boolean {
  return !data || data.length === 0;
}

export function getTrendColor(value: number) {
  switch (value) {
    case -1:
      return 'red';
    case 0:
      return 'transparent';
    default:
      return '#73BF69';
  }
}

export function validateThresholds(thresholds?: ThresholdsConfig) {
  const numberOfSteps = thresholds?.steps.length;
  if (!numberOfSteps || numberOfSteps < 3) {
    return false;
  }

  return true;
}

export function getColors(
  value: number,
  reverseColors: boolean,
  getColorByName: (name: string) => string,
  thresholds?: ThresholdsConfig
) {
  const activeThreshold = getActiveThreshold(value, thresholds?.steps);
  const thresholdSteps = thresholds?.steps ?? [];
  const maybeReversedThresholdSteps = reverseColors ? thresholdSteps.slice().reverse() : thresholdSteps;
  return maybeReversedThresholdSteps.map((threshold) => {
    return {
      color: getColorByName(threshold.color),
      active: threshold.value === activeThreshold.value,
    };
  });
}

export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
