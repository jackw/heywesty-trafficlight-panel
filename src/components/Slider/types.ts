import { MotionValue } from 'motion/react';
import React from 'react';

type Direction = 'left' | 'right' | 'top' | 'bottom';

export interface Size {
  parent: number | null;
  children: number | null;
  item: number | null;
  itemWidth: number | null;
  itemHeight: number | null;
  viewportLength: number | null;
}

export interface SlideshowProps {
  alignment?: string;
  autoPlayControl?: boolean;
  borderRadius?: number;
  direction?: Direction;
  gap?: number;
  intervalControl?: number;
  itemAmount?: number;
  pauseOnHover?: boolean;
  slots: React.ReactNode[];
  startFrom?: number;
  transitionDuration?: number;
}

export interface SlideProps {
  child: React.ReactNode;
  childCounter: number;
  gap: number;
  height: string;
  index: number;
  isHorizontal: boolean;
  size: Size;
  slideKey: string;
  width: string;
  wrappedValue: MotionValue<number>;
}
