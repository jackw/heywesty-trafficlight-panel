import React from 'react';
import { Colors } from 'types';
import { clamp } from 'utils/utils';

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
  const maxViewHeight = 512;
  const verticalMargin = 20;
  const lightBoundary = maxViewHeight - 2 * verticalMargin;

  const maxLightRadius = 50;
  const minLightRadius = 10;
  const minGap = 5;
  const lightCount = colors.length;

  // Initial guess then ensure light radius is within bounds
  let calculatedLightRadius = lightBoundary / (2 * lightCount + (lightCount - 1));
  calculatedLightRadius = clamp(calculatedLightRadius, minLightRadius, maxLightRadius);

  // Calculate the gap to ensure lights are always larger than the gap
  let calculatedGap = calculatedLightRadius / 2;
  calculatedGap = clamp(calculatedGap, minGap, calculatedLightRadius - minGap);

  const lightRadius = clamp(calculatedLightRadius, calculatedGap + minGap, maxLightRadius);
  const totalLightsHeight = lightCount * (2 * lightRadius) + (lightCount - 1) * calculatedGap;
  const centerY = (maxViewHeight - totalLightsHeight) / 2;

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
          fill={bgColor}
          fillRule="evenodd"
          d="M46 13c-11.046 0-20 8.954-20 20v446.095c0 11.046 8.954 20 20 20h180c11.046 0 20-8.954 20-20V33c0-11.046-8.954-20-20-20H46Z"
          clipRule="evenodd"
        />
        {colors.map((light, index) => (
          <Light
            key={index}
            index={index}
            cy={centerY + lightRadius + index * (2 * lightRadius + calculatedGap)}
            lightRadius={lightRadius}
            light={light}
            emptyColor={emptyColor}
          />
        ))}
      </g>
    </svg>
  );
}

function Light({
  index,
  cy,
  lightRadius,
  light,
  emptyColor,
}: {
  index: number;
  cy: number;
  lightRadius: number;
  light: { color: string; active: boolean };
  emptyColor: string;
}) {
  const cx = 136;

  return (
    <g key={index}>
      {light.active ? (
        <g>
          <ellipse
            cx={cx}
            cy={cy}
            rx={lightRadius}
            ry={lightRadius}
            fill={light.color}
            style={{
              filter: `drop-shadow(0 0 16px ${light.color})`,
            }}
          />

          <ellipse
            cx={cx + lightRadius * 0.3}
            cy={cy - lightRadius * 0.45}
            fill="#fff"
            fillOpacity=".35"
            rx={lightRadius / 4}
            ry={lightRadius / 2.5}
            transform={`rotate(-45 153.81 ${cx + lightRadius * 0.3} ${cy - lightRadius * 0.45})`}
          />
        </g>
      ) : (
        <ellipse data-testid={`light-${index}`} cx={136} cy={cy} rx={lightRadius} ry={lightRadius} fill={emptyColor} />
      )}
    </g>
  );
}
