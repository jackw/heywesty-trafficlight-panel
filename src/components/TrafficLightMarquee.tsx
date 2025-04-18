import React from 'react';

import { LightsDataValues, TrafficLightOptions } from '../types';
import { Slideshow } from './Slider/Slideshow';
import { TrafficLight } from './TrafficLight';

interface TrafficLightMarqueeProps {
  options: TrafficLightOptions;
  values: LightsDataValues[];
}

function TrafficLightMarquee({ options, values }: TrafficLightMarqueeProps) {
  const { minLightWidth, layoutMode, style, showLegend, showTrend, showValue, horizontal } = options;
  const lightSlides = values.map((light) => (
    <div key={light.title} style={{ width: minLightWidth, height: "100%" }}>
      <TrafficLight
        light={light}
        trafficLightStyle={style}
        showLegend={showLegend}
        showTrend={showTrend}
        showValue={showValue}
        horizontal={horizontal}
        layoutMode={layoutMode}
        minLightWidth={minLightWidth}
      />
    </div>
  ));

  return (
    <Slideshow
      slots={lightSlides}
      autoPlayControl={true}
      intervalControl={5}
      direction="left"
      itemAmount={2}
      gap={0}
      borderRadius={8}
    />
  );
}

export default TrafficLightMarquee;
