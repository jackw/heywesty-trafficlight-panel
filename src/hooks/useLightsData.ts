import {
  DataFrame,
  FieldType,
  GetFieldDisplayValuesOptions,
  LinkModel,
  ThresholdsConfig,
  getActiveThreshold,
  getFieldDisplayValues,
} from '@grafana/data';
import { useMemo } from 'react';
import { SortOptions } from 'types';
import { basicTrend } from 'utils/utils';

export enum LightsDataResultStatus {
  unsupported = 'unsupported',
  incorrectThresholds = 'incorrectThresholds',
  nodata = 'nodata',
  success = 'success',
}

export type LightsDataValues = {
  title?: string;
  value: string;
  prefix?: string;
  suffix?: string;
  colors?: Array<{
    color: string;
    active: boolean;
  }>;
  trend: {
    color: string;
    value: number;
  };
  hasLinks: boolean;
  getLinks?: () => Array<LinkModel<any>>;
};

export type LightsDataResult = {
  values: LightsDataValues[];
  status: LightsDataResultStatus;
  invalidThresholds?: ThresholdsConfig;
};

type UseLightsData = Omit<GetFieldDisplayValuesOptions, 'reduceOptions'> & {
  sortLights: SortOptions;
  reverseColors: boolean;
};

export function useLightsData(options: UseLightsData): LightsDataResult {
  const { theme, data, fieldConfig, replaceVariables, timeZone, sortLights, reverseColors } = options;

  return useMemo(() => {
    let status = LightsDataResultStatus.nodata;
    let invalidThresholds = undefined;

    if (noData(data)) {
      return {
        values: [
          {
            title: '',
            value: '',
            trend: { color: 'transparent', value: 0 },
            hasLinks: false,
          },
        ],
        status,
      };
    }

    if (!isSupported(data)) {
      return {
        values: [
          {
            title: '',
            value: '',
            trend: { color: 'transparent', value: 0 },
            hasLinks: false,
          },
        ],
        status: LightsDataResultStatus.unsupported,
      };
    }

    const fieldDisplayValues = getFieldDisplayValues({
      fieldConfig: fieldConfig,
      reduceOptions: { calcs: [] },
      replaceVariables,
      theme: theme,
      data: data,
      timeZone,
    });

    const values = fieldDisplayValues.map((displayValue) => {
      const thresholdsValid = validateThresholds(displayValue.field.thresholds);
      const activeThreshold = getActiveThreshold(displayValue.display.numeric, displayValue.field.thresholds?.steps);
      const { title, text, suffix, prefix } = displayValue.display;
      const thresholdSteps = displayValue.field.thresholds?.steps ?? [];
      const maybeReversedThresholdSteps = reverseColors ? thresholdSteps.slice().reverse() : thresholdSteps;
      const colors = maybeReversedThresholdSteps.map((threshold) => {
        return {
          color: theme.visualization.getColorByName(threshold.color),
          active: threshold.value === activeThreshold.value,
        };
      });

      const fieldValues =
        displayValue.view?.dataFrame.fields[1]?.values.toArray() ||
        displayValue.view?.dataFrame.fields[0]?.values.toArray();
      const trendValue = basicTrend(fieldValues);
      const trendColor = theme.visualization.getColorByName(getTrendColor(trendValue));

      if (!thresholdsValid) {
        status = LightsDataResultStatus.incorrectThresholds;
        invalidThresholds = displayValue.field.thresholds;
      } else {
        status = LightsDataResultStatus.success;
      }

      return {
        title,
        value: text,
        prefix,
        suffix,
        colors,
        trend: {
          color: trendColor,
          value: trendValue,
        },
        hasLinks: displayValue.hasLinks,
        getLinks: displayValue.getLinks,
      };
    });

    return {
      values: sortLights === SortOptions.None ? values : sortByValue(values, sortLights),
      invalidThresholds,
      status,
    };
  }, [theme, data, fieldConfig, replaceVariables, timeZone, sortLights, reverseColors]);
}

function sortByValue(arr: LightsDataValues[], sortOrder: SortOptions): LightsDataValues[] {
  return arr.sort((a, b) => {
    if (sortOrder === SortOptions.Asc) {
      return a.value.localeCompare(b.value);
    } else {
      return b.value.localeCompare(a.value);
    }
  });
}

function isSupported(data?: DataFrame[]): boolean {
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

function noData(data?: DataFrame[]): boolean {
  return !data || data.length === 0;
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

function validateThresholds(thresholds?: ThresholdsConfig) {
  const numberOfSteps = thresholds?.steps.length;
  if (!numberOfSteps || numberOfSteps < 3) {
    return false;
  }

  return true;
}
