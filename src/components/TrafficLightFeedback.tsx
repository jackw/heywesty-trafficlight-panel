import { css } from '@emotion/css';
import React from 'react';

import { LIGHTS_DATA_RESULT_STATUSES, TEST_IDS, TRAFFIC_LIGHT_STYLES } from '../constants';
import { TrafficLightFeedbackProps } from '../types';
import ThresholdsAssistant from './ThresholdsAssistant';

export default function TrafficLightFeedback({ status, style, invalidThresholds }: TrafficLightFeedbackProps) {
  const centeredContent = css({
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  if (status === LIGHTS_DATA_RESULT_STATUSES.NoData) {
    return (
      <div data-testid={TEST_IDS.feedbackMsgContainer} className={centeredContent}>
        <h4>The query returned no data.</h4>
      </div>
    );
  }

  if (status === LIGHTS_DATA_RESULT_STATUSES.Unsupported) {
    return (
      <div data-testid={TEST_IDS.feedbackMsgContainer} className={centeredContent}>
        <h4>This data format is unsupported.</h4>
      </div>
    );
  }

  if (status === LIGHTS_DATA_RESULT_STATUSES.IncorrectThresholds && style !== TRAFFIC_LIGHT_STYLES.Dynamic) {
    return (
      <div className={centeredContent}>
        <ThresholdsAssistant thresholds={invalidThresholds} />
      </div>
    );
  }

  return null;
}
