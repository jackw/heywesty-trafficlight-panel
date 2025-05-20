import { LightsDataValues } from './types';

export const TEST_IDS = {
  go: 'traffic-light-go',
  ready: 'traffic-light-ready',
  stop: 'traffic-light-stop',
  trafficLight: 'heywesty-traffic-light',
  trafficLightValueContainer: 'heywesty-traffic-light-value-container',
  trafficLightValue: 'heywesty-traffic-light-value',
  trafficLightLegend: 'heywesty-traffic-light-legend',
  feedbackMsgContainer: 'heywesty-feedback-msg-container',
};

const EMPTY_VALUE: LightsDataValues = {
  title: '',
  value: '',
  numericValue: NaN,
  colors: [],
  trend: { color: 'transparent', value: 0 },
  hasLinks: false,
};

export const LIGHTS_DATA_RESULT_STATUSES = {
  Unsupported: 'unsupported',
  IncorrectThresholds: 'incorrectThresholds',
  NoData: 'nodata',
  Success: 'success',
} as const;

export const DEFAULT_VALUES = {
  values: [EMPTY_VALUE],
  status: LIGHTS_DATA_RESULT_STATUSES.NoData,
  invalidThresholds: undefined,
};

export const SORT_OPTIONS = {
  None: 'none',
  Asc: 'ascending',
  Desc: 'descending',
} as const;

export const LAYOUT_MODES = {
  Grid: 'grid',
  Row: 'row',
} as const;

export const TRAFFIC_LIGHT_STYLES = {
  Default: 'default',
  Rounded: 'rounded',
  SideLights: 'sidelights',
  Dynamic: 'dynamic',
} as const;
