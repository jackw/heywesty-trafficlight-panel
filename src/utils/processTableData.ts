import { DataFrame, Field, FieldType, GrafanaTheme2, hasLinks } from '@grafana/data';
import { LightsDataResult, LightsDataResultStatus } from 'types';

import { DEFAULT_VALUES, LIGHTS_DATA_RESULT_STATUSES } from '../constants';
import { getColors, validateThresholds } from './utils';

export function processTableData(
  theme: GrafanaTheme2,
  data: DataFrame[] | undefined,
  reverseColors: boolean
): LightsDataResult {
  if (!data || data.length === 0) {
    return DEFAULT_VALUES;
  }

  let status: LightsDataResultStatus = LIGHTS_DATA_RESULT_STATUSES.NoData;
  let invalidThresholds;
  const numericField = data![0].fields.find((f: Field) => f.type === FieldType.number);
  const stringField = data![0].fields.find((f: Field) => f.type === FieldType.string);
  let thresholdsValid = validateThresholds(numericField?.config.thresholds);

  if (!numericField || !stringField) {
    return DEFAULT_VALUES;
  }

  const values = numericField.values.toArray().map((value: number, idx) => {
    const { text, suffix, prefix, numeric } = numericField!.display!(value);
    const title = stringField.values.toArray()[idx];
    const colors = getColors(value, reverseColors, theme.visualization.getColorByName, numericField.config.thresholds);
    if (!thresholdsValid) {
      status = LIGHTS_DATA_RESULT_STATUSES.IncorrectThresholds;
      invalidThresholds = numericField.config.thresholds;
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
      // there is no trend when using table data
      trend: { color: 'transparent', value: 0 },
      hasLinks: hasLinks(numericField),
      // table data data links require a valueRowIndex
      getLinks: () => {
        if (numericField.getLinks) {
          return numericField.getLinks({ calculatedValue: { text, numeric }, valueRowIndex: idx });
        }
        return [];
      },
    };
  });

  return { values, status, invalidThresholds };
}
