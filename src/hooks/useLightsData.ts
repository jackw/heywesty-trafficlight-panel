import { FieldConfigSource, GrafanaTheme2 } from '@grafana/data';
import { useTheme2 } from '@grafana/ui';
import { useMemo } from 'react';
import { LightsDataResult, UseLightsData } from 'types';
import { processTableData } from 'utils/processTableData';
import { processTimeSeriesData } from 'utils/processTimeSeriesData';
import { getColors, isSupported, isTimeSeries, noData, sortByValue, validateThresholds } from 'utils/utils';

import { DEFAULT_VALUES, LIGHTS_DATA_RESULT_STATUSES, SORT_OPTIONS } from '../constants';

interface ProcessNoDataOptions {
  fieldConfig: FieldConfigSource;
  reverseColors: boolean;
  theme: GrafanaTheme2;
}

export function processNoData({ fieldConfig, reverseColors, theme }: ProcessNoDataOptions): LightsDataResult {
  const noValue = fieldConfig.defaults.noValue;
  if (noValue === undefined || noValue.trim() === '') {
    return DEFAULT_VALUES;
  }

  const numericValue = Number(noValue);
  if (isNaN(numericValue)) {
    return DEFAULT_VALUES;
  }

  const thresholds = fieldConfig.defaults.thresholds;
  if (!validateThresholds(thresholds)) {
    return {
      ...DEFAULT_VALUES,
      status: LIGHTS_DATA_RESULT_STATUSES.IncorrectThresholds,
      invalidThresholds: thresholds,
    };
  }

  const colors = getColors(numericValue, reverseColors, theme.visualization.getColorByName, thresholds);

  return {
    values: [
      {
        title: '',
        value: noValue,
        numericValue,
        colors,
        trend: { color: 'transparent', value: 0 },
        hasLinks: false,
      },
    ],
    status: LIGHTS_DATA_RESULT_STATUSES.Success,
    invalidThresholds: undefined,
  };
}

export function useLightsData(options: UseLightsData): LightsDataResult {
  const { data, fieldConfig, replaceVariables, timeZone, sortLights, reverseColors } = options;
  const theme = useTheme2();

  return useMemo(() => {
    if (noData(data)) {
      return processNoData({ fieldConfig, reverseColors, theme });
    }

    if (!isSupported(data)) {
      return { ...DEFAULT_VALUES, status: LIGHTS_DATA_RESULT_STATUSES.Unsupported };
    }

    // Support for both time series and table data.
    const { values, status, invalidThresholds } = isTimeSeries(data)
      ? processTimeSeriesData(fieldConfig, theme, data, replaceVariables, timeZone, reverseColors)
      : processTableData(theme, data, reverseColors);

    return {
      values: sortLights === SORT_OPTIONS.None ? values : sortByValue(values, sortLights),
      invalidThresholds,
      status,
    };
  }, [theme, data, fieldConfig, replaceVariables, timeZone, sortLights, reverseColors]);
}
