import { GrafanaTheme2, DataFrame, Field, FieldType, hasLinks } from '@grafana/data';
import { getColors, validateThresholds } from './utils';
import { DEFAULT_VALUES } from '../constants';
import { LightsDataResultStatus, LightsDataResult, LightsDataValues } from 'types';

export function processTableData(
  theme: GrafanaTheme2,
  data: DataFrame[] | undefined,
  reverseColors: boolean
): LightsDataResult {
  if (!data || data.length === 0) {
    return DEFAULT_VALUES;
  }

  let status = LightsDataResultStatus.nodata;
  let invalidThresholds;
  const numericField = data![0].fields.find((f: Field) => f.type === FieldType.number);
  const stringField = data![0].fields.find((f: Field) => f.type === FieldType.string);
  let thresholdsValid = validateThresholds(numericField?.config.thresholds);

  if (!numericField || !stringField) {
    return DEFAULT_VALUES;
  }

  const values = numericField.values.toArray().map((value: number, idx) => {
    const { text, suffix, prefix } = numericField!.display!(value);
    const title = stringField.values.toArray()[idx];
    const colors = getColors(value, reverseColors, theme.visualization.getColorByName, numericField.config.thresholds);
    if (!thresholdsValid) {
      status = LightsDataResultStatus.incorrectThresholds;
      invalidThresholds = numericField.config.thresholds;
    } else {
      status = LightsDataResultStatus.success;
    }

    return {
      title,
      value: text,
      prefix,
      suffix,
      colors,
      // there is no trend when using table data
      trend: { color: 'transparent', value: 0 },
      hasLinks: hasLinks(numericField),
      // numericField.getLinks doesn't match the type of DataLinksContextMenuProps :(
      getLinks: numericField.getLinks as LightsDataValues['getLinks'],
    };
  });

  return { values, status, invalidThresholds };
}
