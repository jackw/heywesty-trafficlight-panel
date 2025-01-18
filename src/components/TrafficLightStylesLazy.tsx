import React, { lazy, Suspense } from 'react';
import { TrafficLightProps } from 'types';

const LazyTrafficLightDefault = lazy(() => import('./TrafficLightDefault'));
const LazyTrafficLightRounded = lazy(() => import('./TrafficLightRounded'));
const LazyTrafficLightSideLights = lazy(() => import('./TrafficLightSideLights'));
const LazyTrafficLightDynamic = lazy(() => import('./TrafficLightDynamic'));

const TrafficLightDefault = (props: TrafficLightProps) => (
  <Suspense fallback={null}>
    <LazyTrafficLightDefault {...props} />
  </Suspense>
);
const TrafficLightRounded = (props: TrafficLightProps) => (
  <Suspense fallback={null}>
    <LazyTrafficLightRounded {...props} />
  </Suspense>
);
const TrafficLightSideLights = (props: TrafficLightProps) => (
  <Suspense fallback={null}>
    <LazyTrafficLightSideLights {...props} />
  </Suspense>
);
const TrafficLightDynamic = (props: TrafficLightProps) => (
  <Suspense fallback={null}>
    <LazyTrafficLightDynamic {...props} />
  </Suspense>
);

export const TrafficLightsComponentMap = {
  default: TrafficLightDefault,
  rounded: TrafficLightRounded,
  sidelights: TrafficLightSideLights,
  dynamic: TrafficLightDynamic,
};
