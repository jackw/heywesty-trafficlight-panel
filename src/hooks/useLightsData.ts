import {
  DataFrame,
  Field,
  FieldType,
  FieldConfigSource,
  GetFieldDisplayValuesOptions,
  GrafanaTheme2,
  LinkModel,
  ThresholdsConfig,
  getActiveThreshold,
  getFieldDisplayValues,
  InterpolateFunction,
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

    if (isTimeSeries(data)) {
      const [values, lightDataStatus, invalidThresholds] = processTimeSeriesData(
        fieldConfig,
        theme,
        data,
        replaceVariables,
        timeZone,
        reverseColors
      );
      return {
        values: sortLights === SortOptions.None ? values : sortByValue(values, sortLights),
        invalidThresholds,
        status: lightDataStatus,
      };
    }

    const [values, lightDataStatus, invalidThresholds] = processTableData(theme, data, reverseColors);
    return {
      values: sortLights === SortOptions.None ? values : sortByValue(values, sortLights),
      invalidThresholds,
      status: lightDataStatus,
    };
  }, [theme, data, fieldConfig, replaceVariables, timeZone, sortLights, reverseColors]);
}

function processTimeSeriesData(
  fieldConfig: FieldConfigSource<any>,
  theme: GrafanaTheme2,
  data: DataFrame[] | undefined,
  replaceVariables: InterpolateFunction,
  timeZone: string | undefined,
  reverseColors: boolean
): [LightsDataValues[], LightsDataResultStatus, ThresholdsConfig | undefined] {
  let lightDataStatus = LightsDataResultStatus.nodata;
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
      lightDataStatus = LightsDataResultStatus.incorrectThresholds;
      invalidThresholds = displayValue.field.thresholds;
    } else {
      lightDataStatus = LightsDataResultStatus.success;
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

  return [values, lightDataStatus, invalidThresholds];
}

function processTableData(
  theme: GrafanaTheme2,
  data: DataFrame[] | undefined,
  reverseColors: boolean
): [LightsDataValues[], LightsDataResultStatus, ThresholdsConfig | undefined] {
  let lightDataStatus = LightsDataResultStatus.nodata;
  let invalidThresholds;
  const numericField = data![0].fields.find((f: Field) => f.type === FieldType.number);
  const stringField = data![0].fields.find((f: Field) => f.type === FieldType.string);
  let thresholdsValid = validateThresholds(numericField?.config.thresholds);

  const values = numericField!.values.toArray().map((value, idx) => {
    const activeThreshold = getActiveThreshold(value, numericField!.config.thresholds?.steps);
    const { text, suffix, prefix } = numericField!.display!(value);
    const thresholdSteps = numericField!.config.thresholds?.steps ?? [];
    const maybeReversedThresholdSteps = reverseColors ? thresholdSteps.slice().reverse() : thresholdSteps;
    const colors = maybeReversedThresholdSteps.map((threshold) => {
      return {
        color: theme.visualization.getColorByName(threshold.color),
        active: threshold.value === activeThreshold.value,
      };
    });

    if (!thresholdsValid) {
      lightDataStatus = LightsDataResultStatus.incorrectThresholds;
      invalidThresholds = numericField!.config.thresholds;
    } else {
      lightDataStatus = LightsDataResultStatus.success;
    }

    return {
      title: stringField!.values.toArray()[idx],
      value: text,
      prefix,
      suffix,
      colors,
      trend: { color: 'transparent', value: 0 },
      hasLinks: value.hasLinks,
      getLinks: value.getLinks,
    };
  });

  return [values, lightDataStatus, invalidThresholds];
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

function isTimeSeries(data?: DataFrame[]): boolean {
  return Boolean(data?.some((d) => d.fields.some((f) => f.type === FieldType.time)));
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
