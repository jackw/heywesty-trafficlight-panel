import { useTheme2 } from '@grafana/ui';
import { useMemo } from 'react';
import { LightsDataResult, UseLightsData } from 'types';
import { processTableData } from 'utils/processTableData';
import { processTimeSeriesData } from 'utils/processTimeSeriesData';
import { isSupported, isTimeSeries, noData, sortByValue } from 'utils/utils';

import { DEFAULT_VALUES, LIGHTS_DATA_RESULT_STATUSES, SORT_OPTIONS } from '../constants';

export function useLightsData(options: UseLightsData): LightsDataResult {
  const { data, fieldConfig, replaceVariables, timeZone, sortLights, reverseColors } = options;
  const theme = useTheme2();

  return useMemo(() => {
    if (noData(data)) {
      return DEFAULT_VALUES;
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
