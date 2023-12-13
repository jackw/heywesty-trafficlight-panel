import {
  DataFrame,
  GetFieldDisplayValuesOptions,
  LinkModel,
  getActiveThreshold,
  getFieldDisplayValues,
} from '@grafana/data';
import { useMemo } from 'react';
import { SortOptions } from 'types';
import { basicTrend } from 'utils';

export enum LightsDataResultStatus {
  unsupported = 'unsupported',
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
};

type UseLightsData = Omit<GetFieldDisplayValuesOptions, 'reduceOptions'> & { sortLights: SortOptions };

export function useLightsData(options: UseLightsData): LightsDataResult {
  const { theme, data, fieldConfig, replaceVariables, timeZone, sortLights } = options;

  return useMemo(() => {
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
        status: LightsDataResultStatus.nodata,
      };
    }

    // TODO: add unsupported scenario here. E.g. Thresholds are incorrect.

    const fieldDisplayValues = getFieldDisplayValues({
      fieldConfig: fieldConfig,
      reduceOptions: { calcs: [] },
      replaceVariables,
      theme: theme,
      data: data,
      timeZone,
    });

    const values = fieldDisplayValues.map((displayValue) => {
      const activeThreshold = getActiveThreshold(displayValue.display.numeric, displayValue.field.thresholds?.steps);
      const { title, text, suffix, prefix } = displayValue.display;
      const colors = displayValue.field.thresholds?.steps.slice(1).map((threshold, i) => {
        const isNegative = displayValue.display.numeric < 0 && i === 0;
        return {
          color: theme.visualization.getColorByName(threshold.color),
          active: isNegative ? true : threshold.value === activeThreshold.value,
        };
      });

      const trendValue = basicTrend(displayValue.view?.dataFrame.fields[1].values.toArray());
      const trendColor = theme.visualization.getColorByName(getTrendColor(trendValue));

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
      status: LightsDataResultStatus.success,
    };
  }, [theme, data, fieldConfig, replaceVariables, timeZone, sortLights]);
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
