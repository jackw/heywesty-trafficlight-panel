import React from 'react';
import { TEST_IDS } from '../constants';

type TrafficLightProps = {
  colors: any;
  bgColor?: string;
  emptyColor?: string;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
  horizontal: boolean;
};

export function TrafficLightSideLights({
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
        {colors[2]?.active && (
          <g>
            <path
              fill={colors[2].color}
              d="M6 389.095c0 27.762 22.524 50.286 50.286 50.286s50.285-22.524 50.285-50.286-22.523-50.285-50.285-50.285C28.524 338.81 6 361.333 6 389.095Z"
              style={{
                filter: `drop-shadow(0 0 4px ${colors[2].color})`,
              }}
            />
            <path
              fill={colors[2].color}
              d="M166 389.095c0 27.762 22.524 50.286 50.286 50.286s50.285-22.524 50.285-50.286-22.523-50.285-50.285-50.285c-27.762 0-50.286 22.523-50.286 50.285Z"
              style={{
                filter: `drop-shadow(0 0 4px ${colors[2].color})`,
              }}
            />
          </g>
        )}
        {colors[1]?.active && (
          <g>
            <path
              fill={colors[1].color}
              d="M6 255c0 27.762 22.524 50.286 50.286 50.286S106.57 282.762 106.57 255s-22.523-50.286-50.285-50.286C28.524 204.714 6 227.238 6 255Z"
              style={{
                filter: `drop-shadow(0 0 4px ${colors[1].color})`,
              }}
            />
            <path
              fill={colors[1].color}
              d="M166 255c0 27.762 22.524 50.286 50.286 50.286s50.285-22.524 50.285-50.286-22.523-50.286-50.285-50.286C188.524 204.714 166 227.238 166 255Z"
              style={{
                filter: `drop-shadow(0 0 4px ${colors[1].color})`,
              }}
            />
          </g>
        )}
        {colors[0]?.active && (
          <g>
            <path
              fill={colors[0].color}
              d="M6 120.905c0 27.762 22.524 50.285 50.286 50.285s50.285-22.523 50.285-50.285c0-27.762-22.523-50.286-50.285-50.286C28.524 70.619 6 93.143 6 120.905Z"
              style={{
                filter: `drop-shadow(0 0 4px ${colors[0].color})`,
              }}
            />
            <path
              fill={colors[0].color}
              d="M166 120.905c0 27.762 22.524 50.285 50.286 50.285s50.285-22.523 50.285-50.285c0-27.762-22.523-50.286-50.285-50.286-27.762 0-50.286 22.524-50.286 50.286Z"
              style={{
                filter: `drop-shadow(0 0 4px ${colors[0].color})`,
              }}
            />
          </g>
        )}
        <path fill={emptyColor} d="M52 57.095h168v398H52z" />
        <path
          fill={bgColor}
          fillRule="evenodd"
          d="M26 33c0-11.046 8.954-20 20-20h180c11.046 0 20 8.954 20 20v31h26l-26 57v77h26l-26 57v77h26l-26 57v90.095c0 11.046-8.954 20-20 20H46c-11.046 0-20-8.954-20-20V389L0 332h26v-77L0 198h26v-77L0 64h26V33Zm110 406.381c-27.762 0-50.286-22.524-50.286-50.286S108.238 338.81 136 338.81s50.286 22.523 50.286 50.285c0 27.762-22.524 50.286-50.286 50.286Zm0-134.095c-27.762 0-50.286-22.524-50.286-50.286s22.524-50.286 50.286-50.286 50.286 22.524 50.286 50.286-22.524 50.286-50.286 50.286Zm0-134.096c-27.762 0-50.286-22.523-50.286-50.285 0-27.762 22.524-50.286 50.286-50.286s50.286 22.524 50.286 50.286S163.762 171.19 136 171.19Z"
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
