import { LayoutGroup, mix, useTransform } from 'motion/react';
import React, { forwardRef, useEffect } from 'react';

import { SlideProps } from './types';

export const Slide = forwardRef<HTMLElement, SlideProps>(function Component(props, ref) {
  const { child, childCounter, gap, height, index, isHorizontal, size, slideKey, width, wrappedValue } = props;

  // Calculate unique offsets + scroll range [0, 1, 1, 0]
  const childOffset = ((size?.item ?? 0) + gap) * childCounter;
  const scrollRange = [-(size?.item ?? 0), 0, (size?.parent ?? 0) - (size?.item ?? 0) + gap, size?.parent ?? 0].map(
    (val) => val - childOffset
  );

  const originXorY = useTransform(wrappedValue, scrollRange, [1, 1, 0, 0]);

  const isVisible = useTransform(wrappedValue, (latest) => latest >= scrollRange[1] && latest <= scrollRange[2]);

  // Handle visibility changes
  useEffect(() => {
    if (!isVisible) {
      return;
    }
    return isVisible.on('change', (newValue) => {
      if (ref && typeof ref === 'object' && 'current' in ref) {
        ref.current?.setAttribute('aria-hidden', String(!newValue));
      }
    });
  }, [isVisible, ref]);

  // Calculate aria-hidden value based on scroll position
  const visibility = useTransform(
    wrappedValue,
    [
      scrollRange[0] - (size?.viewportLength ?? 0),
      mix(scrollRange[1], scrollRange[2], 0.5),
      scrollRange[3] + (size?.viewportLength ?? 0),
    ],
    ['hidden', 'visible', 'hidden']
  );

  return (
    <LayoutGroup inherit="id">
      <li style={{ display: 'contents' }} aria-hidden={index === 0 ? false : true}>
        {React.cloneElement(
          child as React.ReactElement,
          {
            ref,
            key: `${slideKey}child`,
            style: {
              ...(child as React.ReactElement).props?.style,
              flexShrink: 0,
              userSelect: 'none',
              width,
              height,
              originX: isHorizontal ? originXorY : 0.5,
              originY: !isHorizontal ? originXorY : 0.5,
              visibility,
            },
          },
          (child as React.ReactElement).props?.children
        )}
      </li>
    </LayoutGroup>
  );
});
