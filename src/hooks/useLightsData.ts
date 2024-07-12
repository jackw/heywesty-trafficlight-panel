import { DEFAULT_VALUES } from '../constants';
import { useMemo } from 'react';
import { LightsDataResult, SortOptions, UseLightsData } from 'types';
import { processTableData } from 'utils/processTableData';
import { processTimeSeriesData } from 'utils/processTimeSeriesData';
import { isSupported, isTimeSeries, noData, sortByValue } from 'utils/utils';

export function useLightsData(options: UseLightsData): LightsDataResult {
  const { theme, data, fieldConfig, replaceVariables, timeZone, sortLights, reverseColors } = options;
  return useMemo(() => {
    if (noData(data)) {
      return DEFAULT_VALUES;
    }

    if (!isSupported(data)) {
      return DEFAULT_VALUES;
    }

    // Support for both time series and table data.
    const { values, status, invalidThresholds } = isTimeSeries(data)
      ? processTimeSeriesData(fieldConfig, theme, data, replaceVariables, timeZone, reverseColors)
      : processTableData(theme, data, reverseColors);

    return {
      values: sortLights === SortOptions.None ? values : sortByValue(values, sortLights),
      invalidThresholds,
      status,
    };
  }, [theme, data, fieldConfig, replaceVariables, timeZone, sortLights, reverseColors]);
}
