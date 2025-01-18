import { GetFieldDisplayValuesOptions, LinkModel, ThresholdsConfig } from '@grafana/data';

import { LAYOUT_MODES, LIGHTS_DATA_RESULT_STATUSES, SORT_OPTIONS, TRAFFIC_LIGHT_STYLES } from './constants';

export type SortOption = (typeof SORT_OPTIONS)[keyof typeof SORT_OPTIONS];
export type LayoutMode = (typeof LAYOUT_MODES)[keyof typeof LAYOUT_MODES];
export type TrafficLightStyle = (typeof TRAFFIC_LIGHT_STYLES)[keyof typeof TRAFFIC_LIGHT_STYLES];
export type LightsDataResultStatus = (typeof LIGHTS_DATA_RESULT_STATUSES)[keyof typeof LIGHTS_DATA_RESULT_STATUSES];

export type TrafficLightProps = {
  colors: Colors[];
  bgColor?: string;
  emptyColor?: string;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  horizontal: boolean;
};

export interface TrafficLightFeedbackProps {
  status: LightsDataResultStatus;
  style: TrafficLightStyle;
  invalidThresholds?: ThresholdsConfig;
}

export interface TrafficLightOptions {
  minLightWidth: number;
  showValue: boolean;
  showLegend: boolean;
  showTrend: boolean;
  sortLights: SortOption;
  horizontal: boolean;
  singleRow?: boolean;
  layoutMode: LayoutMode;
  style: TrafficLightStyle;
  reverseColors: boolean;
}

export type Colors = {
  color: string;
  active: boolean;
};

export type LightsDataValues = {
  title?: string;
  value: string;
  numericValue: number;
  prefix?: string;
  suffix?: string;
  colors: Colors[];
  trend: {
    color: string;
    value: number;
  };
  hasLinks: boolean;
  getLinks?: () => LinkModel[];
};

export type LightsDataResult = {
  values: LightsDataValues[];
  status: LightsDataResultStatus;
  invalidThresholds?: ThresholdsConfig;
};

export type UseLightsData = Omit<GetFieldDisplayValuesOptions, 'reduceOptions' | 'theme'> & {
  sortLights: SortOption;
  reverseColors: boolean;
};
