import { GetFieldDisplayValuesOptions, LinkModel, ThresholdsConfig } from '@grafana/data';

export enum SortOptions {
  None = 'none',
  Asc = 'ascending',
  Desc = 'descending',
}

export interface TrafficLightOptions {
  minLightWidth: number;
  showValue: boolean;
  showLegend: boolean;
  showTrend: boolean;
  sortLights: SortOptions;
  horizontal: boolean;
  singleRow: boolean;
  style: TrafficLightStyles;
  reverseColors: boolean;
}

export enum TrafficLightStyles {
  Default = 'default',
  Rounded = 'rounded',
  SideLights = 'sidelights',
}

export enum LightsDataResultStatus {
  unsupported = 'unsupported',
  incorrectThresholds = 'incorrectThresholds',
  nodata = 'nodata',
  success = 'success',
}

export type LightsDataValues = {
  title?: string;
  value: string;
  numericValue: number;
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

export type UseLightsData = Omit<GetFieldDisplayValuesOptions, 'reduceOptions'> & {
  sortLights: SortOptions;
  reverseColors: boolean;
};
