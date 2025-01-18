import { DataFrame, FieldConfigSource, getFieldDisplayValues, GrafanaTheme2, InterpolateFunction } from '@grafana/data';

import { DEFAULT_VALUES, LIGHTS_DATA_RESULT_STATUSES } from '../constants';
import { LightsDataResult, LightsDataResultStatus } from '../types';
import { basicTrend, getColors, getTrendColor, validateThresholds } from './utils';

export function processTimeSeriesData(
  fieldConfig: FieldConfigSource<any>,
  theme: GrafanaTheme2,
  data: DataFrame[] | undefined,
  replaceVariables: InterpolateFunction,
  timeZone: string | undefined,
  reverseColors: boolean
): LightsDataResult {
  if (!data || data.length === 0) {
    return DEFAULT_VALUES;
  }

  let status: LightsDataResultStatus = LIGHTS_DATA_RESULT_STATUSES.NoData;
  let invalidThresholds;
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
    const { title, text, suffix, prefix, numeric } = displayValue.display;
    const colors = getColors(
      displayValue.display.numeric,
      reverseColors,
      theme.visualization.getColorByName,
      displayValue.field.thresholds
    );

    const fieldValues =
      displayValue.view?.dataFrame.fields[1]?.values.toArray() ||
      displayValue.view?.dataFrame.fields[0]?.values.toArray();
    const trendValue = basicTrend(fieldValues);
    const trendColor = theme.visualization.getColorByName(getTrendColor(trendValue));

    if (!thresholdsValid) {
      status = LIGHTS_DATA_RESULT_STATUSES.IncorrectThresholds;
      invalidThresholds = displayValue.field.thresholds;
    } else {
      status = LIGHTS_DATA_RESULT_STATUSES.Success;
    }

    return {
      title,
      value: text,
      numericValue: numeric,
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

  return { values, status, invalidThresholds };
}
