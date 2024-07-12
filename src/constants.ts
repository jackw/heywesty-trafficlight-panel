import { LightsDataResultStatus, LightsDataValues } from './types';

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
  trend: { color: 'transparent', value: 0 },
  hasLinks: false,
};

export const DEFAULT_VALUES = {
  values: [EMPTY_VALUE],
  status: LightsDataResultStatus.nodata,
  invalidThresholds: undefined,
};
