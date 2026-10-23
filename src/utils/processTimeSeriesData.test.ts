import { createTheme, FieldType, ThresholdsMode, toDataFrame } from '@grafana/data';

import { DEFAULT_VALUES, LIGHTS_DATA_RESULT_STATUSES } from '../constants';
import { processTimeSeriesData } from './processTimeSeriesData';

describe('processTimeSeriesData', () => {
  it('should return default values when empty timeseries data is passed in', () => {
    const fieldConfig = {
      defaults: {
        mappings: [],
        thresholds: {
          mode: ThresholdsMode.Absolute,
          steps: [
            { value: -Infinity, color: 'green' },
            { value: 0, color: 'red' },
            { value: Infinity, color: 'green' },
          ],
        },
      },
      overrides: [],
    };
    const theme = createTheme();
    const replaceVariables = (value: string) => {
      return value;
    };

    const result = processTimeSeriesData(fieldConfig, theme, [], replaceVariables, 'UTC', false);

    expect(result).toEqual(DEFAULT_VALUES);
  });

  it('should return expected values when timeseries data is passed in', () => {
    const fieldConfig = {
      defaults: {
        mappings: [],
        thresholds: {
          mode: ThresholdsMode.Percentage,
          steps: [
            {
              color: 'red',
              value: -Infinity,
            },
            {
              color: '#EAB839',
              value: 33,
            },
            {
              color: 'green',
              value: 66,
            },
          ],
        },
      },
      overrides: [],
    };
    const theme = createTheme();
    const replaceVariables = (value: string) => {
      return value;
    };

    const dataFrame = [
      {
        refId: 'A',
        fields: [
          {
            name: 'time',
            type: FieldType.time,
            typeInfo: {
              frame: 'time.Time',
              nullable: true,
            },
            config: {
              interval: 1800000,
              thresholds: {
                mode: ThresholdsMode.Percentage,
                steps: [
                  {
                    color: 'red',
                    value: -Infinity,
                  },
                  {
                    color: '#EAB839',
                    value: 33,
                  },
                  {
                    color: 'green',
                    value: 66,
                  },
                ],
              },
              color: {
                mode: 'thresholds',
              },
            },
            values: [1720796735430, 1720798535430],
            entities: {},
            state: {
              scopedVars: {
                __series: {
                  text: 'Series',
                  value: {
                    name: 'Series (A)',
                  },
                },
                __field: {
                  text: 'Field',
                  value: {},
                },
              },
              seriesIndex: 0,
            },
          },
          {
            name: 'A-series',
            type: FieldType.number,
            typeInfo: {
              frame: 'float64',
              nullable: true,
            },
            labels: {},
            config: {
              mappings: [],
              thresholds: {
                mode: ThresholdsMode.Percentage,
                steps: [
                  {
                    color: 'red',
                    value: -Infinity,
                  },
                  {
                    color: '#EAB839',
                    value: 33,
                  },
                  {
                    color: 'green',
                    value: 66,
                  },
                ],
              },
              color: {
                mode: 'thresholds',
              },
            },
            values: [91.86905852758241, 91.53216537627421],
            entities: {},
            state: {
              scopedVars: {
                __series: {
                  text: 'Series',
                  value: {
                    name: 'Series (A)',
                  },
                },
                __field: {
                  text: 'Field',
                  value: {},
                },
              },
              seriesIndex: 0,
              range: {
                min: 91.53216537627421,
                max: 91.86905852758241,
                delta: 0.3368931513082032,
              },
              calcs: {
                last: 91.53216537627421,
              },
              displayName: 'A-series',
              multipleFrames: false,
            },
          },
        ],
        length: 2,
      },
    ];

    const result = processTimeSeriesData(fieldConfig, theme, dataFrame, replaceVariables, 'UTC', false);

    expect(result).toEqual({
      status: 'success',
      invalidThresholds: undefined,
      values: [
        {
          colors: [
            { active: false, color: '#F2495C' },
            { active: false, color: '#EAB839' },
            { active: true, color: '#73BF69' },
          ],
          getLinks: expect.any(Function),
          hasLinks: false,
          prefix: undefined,
          suffix: undefined,
          title: 'A-series',
          trend: { color: '#F2495C', value: -1 },
          value: '91.5',
          numericValue: 91.53216537627421,
        },
      ],
    });
  });

  it('should return incorrect thresholds status when any series has fewer than 3 threshold steps', () => {
    const validThresholds = {
      mode: ThresholdsMode.Absolute,
      steps: [
        { value: -Infinity, color: 'red' },
        { value: 33, color: '#EAB839' },
        { value: 66, color: 'green' },
      ],
    };
    const invalidThresholds = {
      mode: ThresholdsMode.Absolute,
      steps: [
        { value: -Infinity, color: 'red' },
        { value: 50, color: 'green' },
      ],
    };
    const fieldConfig = { defaults: { thresholds: validThresholds }, overrides: [] };
    const theme = createTheme();
    const replaceVariables = (value: string) => {
      return value;
    };
    const timeField = { name: 'time', type: FieldType.time, values: [1, 2] };
    const dataFrames = [
      toDataFrame({
        fields: [
          timeField,
          { name: 'A', type: FieldType.number, values: [10, 20], config: { thresholds: invalidThresholds } },
        ],
      }),
      toDataFrame({
        fields: [
          timeField,
          { name: 'B', type: FieldType.number, values: [10, 20], config: { thresholds: validThresholds } },
        ],
      }),
    ];

    const result = processTimeSeriesData(fieldConfig, theme, dataFrames, replaceVariables, 'UTC', false);

    expect(result.status).toBe(LIGHTS_DATA_RESULT_STATUSES.IncorrectThresholds);
    expect(result.invalidThresholds).toEqual(invalidThresholds);
  });
});
