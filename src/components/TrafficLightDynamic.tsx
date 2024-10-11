import React from 'react';
import { Colors } from 'types';

type TrafficLightProps = {
  colors: Colors[];
  bgColor?: string;
  emptyColor?: string;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  horizontal: boolean;
};

export function TrafficLightDynamic({
  colors = [],
  bgColor = 'grey',
  emptyColor = 'black',
  onClick,
  horizontal = false,
}: TrafficLightProps) {
  const totalAvailableHeight = 406;
  const minGap = 4;
  const maxGap = 24;
  const numberOfLights = colors.length;
  const x = 52;
  const lightWidth = 168;
  const { height, yPosition } = calculateLightPositions(totalAvailableHeight, minGap, maxGap, numberOfLights);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox={horizontal ? '0 0 512 272' : '0 0 272 512'}
      style={{ height: '100%', width: '100%' }}
      onClick={onClick}
    >
      <g transform={horizontal ? 'rotate(-90 0 0)' : undefined} style={{ transformOrigin: '25% center' }}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M46 13C34.9543 13 26 21.9543 26 33V479.095C26 490.141 34.9543 499.095 46 499.095H226C237.046 499.095 246 490.141 246 479.095V33C246 21.9543 237.046 13 226 13H46Z"
          fill={bgColor}
        />

        {colors.map((light, index) => (
          <g key={index}>
            <rect
              x={x}
              y={yPosition[index]}
              width={lightWidth}
              height={height}
              rx="8"
              fill={light.active ? light.color : emptyColor}
              style={
                light.active
                  ? {
                      filter: `drop-shadow(0 0 16px ${light.color})`,
                    }
                  : {}
              }
            />
            {light.active && (
              <ellipse
                cx={x + lightWidth - 16}
                cy={yPosition[index] + 16}
                rx={8}
                ry={8}
                fill="white"
                fillOpacity="0.35"
              />
            )}
          </g>
        ))}
      </g>
    </svg>
  );
}

function calculateLightPositions(
  totalHeight: number,
  minGap: number,
  maxGap: number,
  numberOfLights: number,
  startOffset = 57
) {
  const numGaps = numberOfLights - 1;
  const initialGapSize = maxGap / (numberOfLights * 0.5);
  const gapSize = Math.max(minGap, Math.min(maxGap, initialGapSize));
  const totalGapHeight = gapSize * numGaps;
  const remainingHeightForLights = totalHeight - totalGapHeight;
  const lightHeight = remainingHeightForLights / numberOfLights;

  let currentYPosition = startOffset;
  const yPositions: number[] = [];

  for (let i = 0; i < numberOfLights; i++) {
    yPositions.push(currentYPosition);
    currentYPosition += lightHeight + gapSize;
  }

  return {
    height: lightHeight,
    yPosition: yPositions,
  };
}
