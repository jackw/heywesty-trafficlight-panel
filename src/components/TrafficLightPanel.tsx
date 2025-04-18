import { css } from '@emotion/css';
import { PanelProps } from '@grafana/data';
import { useLightsData } from 'hooks/useLightsData';
import React, { lazy, Suspense } from 'react';
import { calculateRowsAndColumns } from 'utils/utils';

import { LAYOUT_MODES, LIGHTS_DATA_RESULT_STATUSES, TEST_IDS } from '../constants';
import { LayoutMode, TrafficLightFeedbackProps, TrafficLightOptions } from '../types';
import { TrafficLight } from './TrafficLight';
import TrafficLightMarquee from './TrafficLightMarquee';

const LazyTrafficLightFeedback = lazy(() => import('./TrafficLightFeedback'));

const TrafficLightFeedback = (props: TrafficLightFeedbackProps) => (
  <Suspense fallback={null}>
    <LazyTrafficLightFeedback {...props} />
  </Suspense>
);

interface TrafficLightPanelProps extends PanelProps<TrafficLightOptions> {}

export function TrafficLightPanel({
  data,
  width,
  height,
  options,
  replaceVariables,
  fieldConfig,
  timeZone,
}: TrafficLightPanelProps) {
  const { minLightWidth, sortLights, layoutMode, style, showLegend, showTrend, showValue, horizontal, reverseColors } =
    options;

  const { values, status, invalidThresholds } = useLightsData({
    fieldConfig,
    replaceVariables,
    data: data.series,
    timeZone,
    sortLights,
    reverseColors,
  });

  const { rows, cols } = calculateRowsAndColumns(width, minLightWidth, values.length);
  const containerStyle = getStyles({ rows, cols, layoutMode, minLightWidth });

  if (status !== LIGHTS_DATA_RESULT_STATUSES.Success) {
    return <TrafficLightFeedback status={status} invalidThresholds={invalidThresholds} style={style} />;
  }

  return (
    <div
      style={{
        width,
        height,
      }}
      data-testid={TEST_IDS.trafficLight}
    >
      {layoutMode === LAYOUT_MODES.Marquee ? (
        <TrafficLightMarquee options={options} values={values} />
      ) : (
        <div className={containerStyle}>
          {values.map((light) => (
            <TrafficLight
              key={light.title}
              light={light}
              trafficLightStyle={style}
              showLegend={showLegend}
              showTrend={showTrend}
              showValue={showValue}
              horizontal={horizontal}
              layoutMode={layoutMode}
              minLightWidth={minLightWidth}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function getStyles({
  rows,
  cols,
  layoutMode,
  minLightWidth,
}: {
  rows: number;
  cols: number;
  layoutMode: LayoutMode;
  minLightWidth: number;
}) {
  const columnCSS = `repeat(${cols}, minmax(${minLightWidth}px, 1fr))`;
  const rowsCSS = `repeat(${rows},  ${100 / rows}%)`;

  if (layoutMode === LAYOUT_MODES.Grid) {
    return css({
      display: 'grid',
      alignContent: 'start',
      gridTemplateColumns: columnCSS,
      gridTemplateRows: rowsCSS,
      justifyContent: 'center',
      minHeight: '100%',
      height: '100%',
      boxSizing: 'border-box',
    });
  }

  return css({
    display: 'flex',
    height: '100%',
    minHeight: '100%',
    overflowX: LAYOUT_MODES.Marquee ? 'hidden' : 'auto',
  });
}
