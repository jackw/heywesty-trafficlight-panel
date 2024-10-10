import { createTheme, FieldType, ThresholdsMode } from '@grafana/data';
import { processTableData } from './processTableData';
import { DEFAULT_VALUES } from '../constants';

describe('processTableData', () => {
  it('should return default values when empty timeseries data is passed in', () => {
    const theme = createTheme();

    const result = processTableData(theme, [], false);

    expect(result).toEqual(DEFAULT_VALUES);
  });

  it('should return expected values when timeseries data is passed in', () => {
    const theme = createTheme();
    const displayMock = (value: any) => ({
      numeric: value,
      text: value.toString(),
      suffix: undefined,
      prefix: undefined,
    });
    const dataFrame = [
      {
        refId: 'A',
        fields: [
          {
            name: 'Name',
            type: FieldType.string,
            typeInfo: {
              frame: 'string',
              nullable: true,
            },
            config: {
              color: {
                mode: 'thresholds',
              },
              mappings: [],
              thresholds: {
                mode: ThresholdsMode.Absolute,
                steps: [
                  {
                    color: 'red',
                    value: -Infinity,
                  },
                  {
                    color: '#EAB839',
                    value: 2,
                  },
                  {
                    color: '#73BF69',
                    value: 4,
                  },
                ],
              },
            },
            display: displayMock,
            values: ['Blob Storage', 'Exported Storage'],
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
            name: 'Value',
            type: FieldType.number,
            typeInfo: {
              frame: 'int64',
              nullable: true,
            },
            config: {
              color: {
                mode: 'thresholds',
              },
              mappings: [],
              thresholds: {
                mode: ThresholdsMode.Absolute,
                steps: [
                  {
                    color: 'red',
                    value: -Infinity,
                  },
                  {
                    color: '#EAB839',
                    value: 2,
                  },
                  {
                    color: '#73BF69',
                    value: 4,
                  },
                ],
              },
            },
            display: displayMock,
            values: [1, 4],
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
              seriesIndex: 1,
              range: {
                min: 1,
                max: 5,
                delta: 4,
              },
            },
          },
        ],
        length: 5,
      },
    ];

    const result = processTableData(theme, dataFrame, false);

    expect(result).toEqual({
      status: 'success',
      invalidThresholds: undefined,
      values: [
        {
          title: 'Blob Storage',
          value: '1',
          numericValue: 1,
          prefix: undefined,
          suffix: undefined,
          colors: [
            { active: true, color: '#F2495C' },
            { active: false, color: '#EAB839' },
            { active: false, color: '#73BF69' },
          ],
          trend: { color: 'transparent', value: 0 },
          hasLinks: false,
          getLinks: undefined,
        },
        {
          title: 'Exported Storage',
          value: '4',
          numericValue: 4,
          prefix: undefined,
          suffix: undefined,
          colors: [
            { active: false, color: '#F2495C' },
            { active: false, color: '#EAB839' },
            { active: true, color: '#73BF69' },
          ],
          trend: { color: 'transparent', value: 0 },
          hasLinks: false,
          getLinks: undefined,
        },
      ],
    });
  });
});
