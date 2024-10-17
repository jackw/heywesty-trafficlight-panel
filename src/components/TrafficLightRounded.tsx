import React from 'react';
import { TEST_IDS } from '../constants';
import { TrafficLightProps } from 'types';

export default function TrafficLightRounded({
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
        <path fill={emptyColor} d="M52 57.095h168v398H52z" />
        <path
          fill={bgColor}
          fillRule="evenodd"
          d="M46 13c-11.046 0-20 8.954-20 20v446.095c0 11.046 8.954 20 20 20h180c11.046 0 20-8.954 20-20V33c0-11.046-8.954-20-20-20H46Zm39.714 376.095c0 27.762 22.524 50.286 50.286 50.286s50.286-22.524 50.286-50.286S163.762 338.81 136 338.81s-50.286 22.523-50.286 50.285Zm0-134.095c0 27.762 22.524 50.286 50.286 50.286s50.286-22.524 50.286-50.286-22.524-50.286-50.286-50.286S85.714 227.238 85.714 255Zm0-134.095c0 27.762 22.524 50.285 50.286 50.285s50.286-22.523 50.286-50.285c0-27.762-22.524-50.286-50.286-50.286s-50.286 22.524-50.286 50.286Z"
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
              cx="153.81"
              cy="365.524"
              fill="#fff"
              fillOpacity=".35"
              rx="12.571"
              ry="20.429"
              transform="rotate(-45 153.81 365.524)"
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
              cx="153.81"
              cy="231.429"
              fill="#fff"
              fillOpacity=".35"
              rx="12.571"
              ry="20.429"
              transform="rotate(-45 153.81 231.429)"
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
              cx="153.81"
              cy="97.333"
              fill="#fff"
              fillOpacity=".35"
              rx="12.571"
              ry="20.429"
              transform="rotate(-45 153.81 97.333)"
            />
          </g>
        )}
      </g>
    </svg>
  );
}
