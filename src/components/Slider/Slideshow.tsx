import useResizeObserver from '@react-hook/resize-observer';
import {
  animate,
  DraggableProps,
  frame,
  motion,
  PanInfo,
  useInView,
  useMotionValue,
  useTransform,
  wrap,
} from 'motion/react';
import React, { Children, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { Slide } from './Slide';
import { Size, SlideshowProps } from './types';

const containerStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  margin: 0,
  padding: 0,
};
// Custom hook to wait for refs to be populated
function useRefReady(refs: Array<{ current: HTMLElement | null }>) {
  const [refsReady, setRefsReady] = useState(false);

  useEffect(() => {
    // Check if all refs are already populated
    if (refs.every((ref) => ref.current !== null)) {
      setRefsReady(true);
      return;
    }

    // Create a MutationObserver to watch for DOM changes
    const observer = new MutationObserver(() => {
      // Check if all refs are now populated
      if (refs.every((ref) => ref.current !== null)) {
        setRefsReady(true);
        observer.disconnect();
      }
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Clean up the observer when the component unmounts
    return () => observer.disconnect();
  }, [refs]);

  return refsReady;
}

export function Slideshow(props: SlideshowProps) {
  const {
    alignment = 'center',
    autoPlayControl = true,
    borderRadius = 0,
    direction = 'left',
    gap = 0,
    intervalControl = 3,
    itemAmount = 1,
    pauseOnHover = true,
    slots,
    startFrom = 0,
    transitionDuration = 0.5,
  } = props;

  const [shouldPlayOnHover, setShouldPlayOnHover] = useState<boolean>(autoPlayControl);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<number>(startFrom);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const parentRef = useRef<HTMLUListElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const visibilityRef = useRef<HTMLElement>(null);
  const initialResize = useRef<boolean>(true);

  const filteredSlots = slots.filter(Boolean);
  const hasChildren = Children.count(filteredSlots) > 0;

  const isHorizontal = direction === 'left' || direction === 'right';
  const isInverted = direction === 'right' || direction === 'bottom';

  const childrenRef = useMemo(() => {
    return Array(filteredSlots.length)
      .fill(null)
      .map(() => ({ current: null }));
  }, [filteredSlots.length]);

  // Use our custom hook to wait for refs to be ready
  const refsReady = useRefReady(childrenRef);

  const [size, setSize] = useState<Size>({
    parent: null,
    children: null,
    item: null,
    itemWidth: null,
    itemHeight: null,
    viewportLength: null,
  });

  // Motion values
  const xOrY = useMotionValue(0);
  const wrappedValue = useTransform(xOrY, (value: number) => {
    if (!size.children) {
      return 0;
    }
    const wrapped = wrap(-size.children, -size.children * 2, value);
    return isNaN(wrapped) ? 0 : wrapped;
  });

  // Calculate positions
  const itemWithGap = (size?.item || 0) + gap;

  // Measurement functions
  const measure = useCallback(() => {
    const firstChild = childrenRef[0]?.current as HTMLElement | null;
    const lastChild = childrenRef[filteredSlots.length - 1]?.current as HTMLElement | null;

    if (hasChildren && parentRef.current) {
      const parentLength = isHorizontal ? parentRef.current.offsetWidth : parentRef.current.offsetHeight;

      // If we don't have child elements yet, use default values
      if (!firstChild || !lastChild) {
        setSize({
          parent: parentLength,
          children: parentLength,
          item: parentLength,
          itemWidth: parentLength,
          itemHeight: parentLength,
          viewportLength: parentLength,
        });
        return;
      }

      const start = isHorizontal ? firstChild.offsetLeft : firstChild.offsetTop;

      const end = isHorizontal
        ? lastChild.offsetLeft + lastChild.offsetWidth
        : lastChild.offsetTop + lastChild.offsetHeight;

      const childrenLength = end - start + gap;
      const itemSize = isHorizontal ? firstChild.offsetWidth : firstChild.offsetHeight;

      const itemWidth = firstChild.offsetWidth;
      const itemHeight = firstChild.offsetHeight;

      const viewportLength = isHorizontal
        ? Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0, parentRef.current.offsetWidth)
        : Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0, parentRef.current.offsetHeight);

      setSize({
        parent: parentLength,
        children: childrenLength,
        item: itemSize,
        itemWidth: itemWidth,
        itemHeight: itemHeight,
        viewportLength: viewportLength,
      });
    }
  }, [hasChildren, isHorizontal, gap, childrenRef, filteredSlots.length]);

  // Schedule measurement
  const scheduleMeasure = useCallback(() => {
    // Always call measure, even if refs aren't available yet
    // This will handle the case where size is already set
    frame.read(measure);
  }, [measure]);

  // Layout effects
  useLayoutEffect(() => {
    if (hasChildren) {
      scheduleMeasure();
    }
  }, [hasChildren, itemAmount, scheduleMeasure]);

  // Effect to measure when refs are ready
  useEffect(() => {
    if (refsReady) {
      scheduleMeasure();
    }
  }, [refsReady, scheduleMeasure]);

  useResizeObserver(parentRef, ({ contentRect }) => {
    if (!initialResize.current && (contentRect.width || contentRect.height)) {
      scheduleMeasure();
      setIsResizing(true);
    }
    initialResize.current = false;
  });

  useEffect(() => {
    if (isResizing) {
      const timer = setTimeout(() => setIsResizing(false), 500);
      return () => clearTimeout(timer);
    }
    return;
  }, [isResizing]);

  const setDelta = (delta: number) => {
    if (!isInverted) {
      setCurrentItem(currentItem + delta);
    } else {
      setCurrentItem(currentItem - delta);
    }
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (_: MouseEvent, { offset, velocity }: PanInfo): void => {
    setIsDragging(false);
    const offsetXorY = isHorizontal ? offset.x : offset.y;
    const velocityXorY = isHorizontal ? velocity.x : velocity.y;
    const isHalfOfNext = offsetXorY < -(size.item || 0) / 2;
    const isHalfOfPrev = offsetXorY > (size.item || 0) / 2;

    const normalizedOffset = Math.abs(offsetXorY);
    const itemDelta = Math.round(normalizedOffset / (size.item || 1));
    const itemDeltaFromOne = itemDelta === 0 ? 1 : itemDelta;

    if (velocityXorY > 200) {
      setDelta(-itemDeltaFromOne);
    } else if (velocityXorY < -200) {
      setDelta(itemDeltaFromOne);
    } else {
      if (isHalfOfNext) {
        setDelta(itemDelta);
      }
      if (isHalfOfPrev) {
        setDelta(-itemDelta);
      }
    }
  };

  const switchPages = useCallback(() => {
    if (!hasChildren || !size.parent || isDragging) {
      return;
    }

    const newPosition = () => (isInverted ? 1 : -1) * currentItem * itemWithGap;

    if (xOrY.get() !== newPosition()) {
      animate(xOrY, newPosition(), { duration: transitionDuration });
    }

    if (autoPlayControl && shouldPlayOnHover) {
      timeoutRef.current = setTimeout(() => {
        setCurrentItem(currentItem + 1);
        switchPages();
      }, intervalControl * 1000);
    }
  }, [
    hasChildren,
    size.parent,
    isDragging,
    isInverted,
    currentItem,
    itemWithGap,
    xOrY,
    transitionDuration,
    autoPlayControl,
    shouldPlayOnHover,
    intervalControl,
  ]);

  // Visibility handling
  const isVisible = useInView(visibilityRef);

  // Effect for autoplay
  useEffect(() => {
    if (!isVisible || isResizing) {
      return;
    }
    switchPages();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentItem, isVisible, isResizing, switchPages]);

  // Empty state
  if (!hasChildren) {
    console.log('No children, add children to render the slideshow');
    return null;
  }

  const dupedChildren = [];
  const duplicateBy = 4;
  let childCounter = 0;

  for (let index = 0; index < duplicateBy; index++) {
    dupedChildren.push(
      ...(Children.map(filteredSlots, (child, childIndex) => {
        const ref = childrenRef[childIndex];
        const calcDimension = itemAmount > 1 ? `calc(${100 / itemAmount}% - ${gap}px + ${gap / itemAmount}px)` : '100%';

        return (
          <Slide
            key={`${index}-${childIndex}-lg`}
            ref={ref}
            slideKey={`${index}-${childIndex}-lg`}
            index={index}
            width={isHorizontal ? calcDimension : '100%'}
            height={!isHorizontal ? calcDimension : '100%'}
            size={size}
            child={child}
            wrappedValue={wrappedValue}
            childCounter={childCounter++}
            gap={gap}
            isHorizontal={isHorizontal}
          />
        );
      }) ?? [])
    );
  }

  // Drag props
  const dragProps = {
    drag: isHorizontal ? 'x' : ('y' as DraggableProps['drag']),
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    dragDirectionLock: true,
    values: { x: xOrY, y: xOrY },
    dragMomentum: false,
  };

  return (
    <section
      style={{
        ...containerStyle,
        opacity: size?.item !== null ? 1 : 0,
        userSelect: 'none',
      }}
      onMouseEnter={() => {
        if (pauseOnHover) {
          setShouldPlayOnHover(false);
        }
      }}
      onMouseLeave={() => {
        if (pauseOnHover) {
          setShouldPlayOnHover(true);
        }
      }}
      ref={visibilityRef}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 'inherit',
          position: 'absolute',
          inset: 0,
          overflow: 'visible',
          borderRadius,
          userSelect: 'none',
        }}
      >
        <motion.ul
          ref={parentRef}
          {...dragProps}
          style={{
            ...containerStyle,
            gap,
            placeItems: alignment,
            x: isHorizontal ? wrappedValue : 0,
            y: !isHorizontal ? wrappedValue : 0,
            flexDirection: isHorizontal ? 'row' : 'column',
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            overflow: 'visible',
          }}
        >
          {dupedChildren}
        </motion.ul>
      </div>
    </section>
  );
}
