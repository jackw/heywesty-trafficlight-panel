import { GrafanaTheme2, DataFrame, InterpolateFunction, getFieldDisplayValues, FieldConfigSource } from '@grafana/data';
import { validateThresholds, basicTrend, getTrendColor, getColors } from './utils';
import { LightsDataResultStatus, LightsDataResult } from '../types';

export function processTimeSeriesData(
  fieldConfig: FieldConfigSource<any>,
  theme: GrafanaTheme2,
  data: DataFrame[] | undefined,
  replaceVariables: InterpolateFunction,
  timeZone: string | undefined,
  reverseColors: boolean
): LightsDataResult {
  let status = LightsDataResultStatus.nodata;
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
    const { title, text, suffix, prefix } = displayValue.display;
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

  return { values, status, invalidThresholds };
}
