import React from 'react';
import { TrafficLightProps } from 'types';

import { TEST_IDS } from '../constants';

export default function TrafficLightDefault({
  colors = [],
  bgColor = 'grey',
  emptyColor = 'black',
  onClick,
  horizontal = false,
}: TrafficLightProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox={horizontal ? '0 0 512 272' : '0 0 272 512'}
      style={{ height: '100%', width: '100%' }}
      onClick={onClick}
    >
      <g transform={horizontal ? 'rotate(-90 0 0)' : undefined} style={{ transformOrigin: '25% center' }}>
        <path fill={"emptyColor"} d="M52 57.095h168v398H52z" />
        <path
          fill={bgColor}
          fillRule="evenodd"
          d="M218.5 13c15.142 0 27.5 11.605 27.5 26.774 0 62.951 0 259.331-3.355 370.274C232.762 459.766 188.736 497 135.997 497c-52.74 0-96.783-37.234-107.422-86.952 0-57.875-.77-141.346-1.467-217.035C26.529 130.231 26 72.803 26 39.774 26 25.38 38.358 13 53.5 13h165ZM136 171.19c-27.762 0-50.286-22.523-50.286-50.285 0-27.762 22.524-50.286 50.286-50.286s50.286 22.524 50.286 50.286S163.762 171.19 136 171.19ZM85.714 255c0 27.762 22.524 50.286 50.286 50.286s50.286-22.524 50.286-50.286-22.524-50.286-50.286-50.286S85.714 227.238 85.714 255Zm0 134.095c0 27.762 22.524 50.286 50.286 50.286s50.286-22.524 50.286-50.286S163.762 338.81 136 338.81s-50.286 22.523-50.286 50.285Z"
          clipRule="evenodd"
        />
        {colors[2]?.active && (
          <g>
            <path
              data-testid={TEST_IDS.go}
              fill={colors[2].color}
              d="M85.714 389.095c0 27.762 22.524 50.286 50.286 50.286s50.286-22.524 50.286-50.286S163.762 338.81 136 338.81s-50.286 22.523-50.286 50.285Z"
              style={{
                filter: `drop-shadow(0 0 16px ${colors[2].color})`,
              }}
            />
            <path
              fill="#000"
              fillOpacity=".1"
              fillRule="evenodd"
              d="M162.469 431.854a64.427 64.427 0 0 1-4.993.194c-35.004 0-63.38-28.377-63.38-63.381a64 64 0 0 1 .516-8.132 50.044 50.044 0 0 0-8.898 28.56c0 27.762 22.524 50.286 50.286 50.286 9.71 0 18.78-2.756 26.469-7.527Z"
              clipRule="evenodd"
            />
            <ellipse
              cx="153.809"
              cy="365.524"
              fill="#fff"
              fillOpacity=".35"
              rx="12.571"
              ry="20.429"
              transform="rotate(-45 153.809 365.524)"
            />
          </g>
        )}
        {colors[1]?.active && (
          <g>
            <path
              data-testid={TEST_IDS.ready}
              fill={colors[1].color}
              d="M85.714 255c0 27.762 22.524 50.286 50.286 50.286s50.286-22.524 50.286-50.286-22.524-50.286-50.286-50.286S85.714 227.238 85.714 255Z"
              style={{
                filter: `drop-shadow(0 0 16px ${colors[1].color})`,
              }}
            />
            <path
              fill="#000"
              fillOpacity=".1"
              fillRule="evenodd"
              d="M162.469 297.759a64.43 64.43 0 0 1-4.993.193c-35.004 0-63.38-28.376-63.38-63.381 0-2.755.175-5.469.516-8.131A50.042 50.042 0 0 0 85.714 255c0 27.762 22.524 50.286 50.286 50.286 9.71 0 18.78-2.756 26.469-7.527Z"
              clipRule="evenodd"
            />
            <ellipse
              cx="153.809"
              cy="231.429"
              fill="#fff"
              fillOpacity=".35"
              rx="12.571"
              ry="20.429"
              transform="rotate(-45 153.809 231.429)"
            />
          </g>
        )}
        {colors[0]?.active && (
          <g>
            <path
              data-testid={TEST_IDS.stop}
              fill={colors[0].color}
              d="M85.714 120.905c0 27.762 22.524 50.285 50.286 50.285s50.286-22.523 50.286-50.285c0-27.762-22.524-50.286-50.286-50.286s-50.286 22.524-50.286 50.286Z"
              style={{
                filter: `drop-shadow(0 0 16px ${colors[0].color})`,
              }}
            />
            <path
              fill="#000"
              fillOpacity=".1"
              fillRule="evenodd"
              d="M162.469 163.663a63.933 63.933 0 0 1-4.993.194c-35.004 0-63.38-28.376-63.38-63.381 0-2.755.175-5.469.516-8.131a50.042 50.042 0 0 0-8.898 28.56c0 27.762 22.524 50.286 50.286 50.286 9.71 0 18.78-2.756 26.469-7.528Z"
              clipRule="evenodd"
            />
            <ellipse
              cx="153.809"
              cy="97.333"
              fill="#fff"
              fillOpacity=".35"
              rx="12.571"
              ry="20.429"
              transform="rotate(-45 153.809 97.333)"
            />
          </g>
        )}
      </g>
    </svg>
  );
}
