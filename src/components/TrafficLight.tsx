import React from 'react';

type TrafficLightProps = {
  colors: any;
  bgColor?: string;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  horizontal: boolean;
};

export function TrafficLight({ colors = [], bgColor = 'grey', onClick, horizontal = false }: TrafficLightProps) {
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
          d="M264 32C264 14.38 249.62.9 232 .9H40C22.38.9 8 15.28 8 32c0 84.616 2.996 256 2.996 378.987 12.38 57.75 63.63 101 125 101s112.6-43.25 124.1-101C264 282.12 264 105.121 264 32ZM136 416c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48Zm0-128c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48Zm0-128c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48Z"
        />
        {colors[2]?.active && (
          <g>
            <path
              fill={colors[2].color}
              d="M88 368c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48Z"
              style={{
                filter: `drop-shadow(0 0 16px ${colors[2].color})`,
              }}
            />
            <path
              fill="#000"
              fillOpacity=".1"
              fillRule="evenodd"
              d="M161.266 408.815a61.121 61.121 0 0 1-4.766.185c-33.413 0-60.5-27.087-60.5-60.5 0-2.63.168-5.22.493-7.762A47.77 47.77 0 0 0 88 368c0 26.5 21.5 48 48 48a47.76 47.76 0 0 0 25.266-7.185Z"
              clipRule="evenodd"
            />
            <ellipse
              cx="153"
              cy="345.5"
              fill="#fff"
              fillOpacity=".35"
              rx="12"
              ry="19.5"
              transform="rotate(-45 153 345.5)"
            />
          </g>
        )}
        {colors[1]?.active && (
          <g>
            <path
              fill={colors[1].color}
              d="M88 240c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48Z"
              style={{
                filter: `drop-shadow(0 0 16px ${colors[1].color})`,
              }}
            />
            <path
              fill="#000"
              fillOpacity=".1"
              fillRule="evenodd"
              d="M161.266 280.815a61.121 61.121 0 0 1-4.766.185c-33.413 0-60.5-27.087-60.5-60.5 0-2.63.168-5.22.493-7.762A47.77 47.77 0 0 0 88 240c0 26.5 21.5 48 48 48a47.76 47.76 0 0 0 25.266-7.185Z"
              clipRule="evenodd"
            />
            <ellipse
              cx="153"
              cy="217.5"
              fill="#fff"
              fillOpacity=".35"
              rx="12"
              ry="19.5"
              transform="rotate(-45 153 217.5)"
            />
          </g>
        )}
        {colors[0]?.active && (
          <g>
            <path
              fill={colors[0].color}
              d="M88 112c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48Z"
              style={{
                filter: `drop-shadow(0 0 16px ${colors[0].color})`,
              }}
            />
            <path
              fill="#000"
              fillOpacity=".1"
              fillRule="evenodd"
              d="M161.266 152.815a61.121 61.121 0 0 1-4.766.185C123.087 153 96 125.913 96 92.5c0-2.63.168-5.22.493-7.762A47.767 47.767 0 0 0 88 112c0 26.5 21.5 48 48 48a47.76 47.76 0 0 0 25.266-7.185Z"
              clipRule="evenodd"
            />
            <ellipse
              cx="153"
              cy="89.5"
              fill="#fff"
              fillOpacity=".35"
              rx="12"
              ry="19.5"
              transform="rotate(-45 153 89.5)"
            />
          </g>
        )}
      </g>
    </svg>
  );
}
