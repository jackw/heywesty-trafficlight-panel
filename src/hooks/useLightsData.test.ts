import { createTheme, FieldConfigSource, ThresholdsMode } from '@grafana/data';

import { LIGHTS_DATA_RESULT_STATUSES } from '../constants';
import { processNoData } from './useLightsData';

const theme = createTheme();

const defaultFieldConfig: FieldConfigSource = {
  defaults: {
    mappings: [],
    thresholds: {
      mode: ThresholdsMode.Absolute,
      steps: [
        { value: -Infinity, color: 'red' },
        { value: 40, color: 'orange' },
        { value: 70, color: 'green' },
      ],
    },
  },
  overrides: [],
};

const fieldConfigWithNoValue = (noValue: string): FieldConfigSource => ({
  ...defaultFieldConfig,
  defaults: { ...defaultFieldConfig.defaults, noValue },
});

describe('processNoData', () => {
  it('should return NoData status when noValue is not set', () => {
    const result = processNoData({ fieldConfig: defaultFieldConfig, reverseColors: false, theme });

    expect(result.status).toBe(LIGHTS_DATA_RESULT_STATUSES.NoData);
  });

  it('should return NoData status when noValue is empty string', () => {
    const result = processNoData({ fieldConfig: fieldConfigWithNoValue(''), reverseColors: false, theme });

    expect(result.status).toBe(LIGHTS_DATA_RESULT_STATUSES.NoData);
  });

  it('should return NoData status when noValue is a non-numeric string', () => {
    const result = processNoData({ fieldConfig: fieldConfigWithNoValue('abc'), reverseColors: false, theme });

    expect(result.status).toBe(LIGHTS_DATA_RESULT_STATUSES.NoData);
  });

  it('should return NoData status when noValue is whitespace only', () => {
    const result = processNoData({ fieldConfig: fieldConfigWithNoValue('   '), reverseColors: false, theme });

    expect(result.status).toBe(LIGHTS_DATA_RESULT_STATUSES.NoData);
  });

  it('should return Success with correct colors when noValue is set to a valid number', () => {
    const result = processNoData({ fieldConfig: fieldConfigWithNoValue('0'), reverseColors: false, theme });

    expect(result.status).toBe(LIGHTS_DATA_RESULT_STATUSES.Success);
    expect(result.values).toHaveLength(1);
    expect(result.values[0].numericValue).toBe(0);
    expect(result.values[0].value).toBe('0');
    // Value 0 falls in the first threshold step (red, value: -Infinity)
    expect(result.values[0].colors[0].active).toBe(true);
    expect(result.values[0].colors[1].active).toBe(false);
    expect(result.values[0].colors[2].active).toBe(false);
  });

  it('should activate the correct threshold step based on noValue', () => {
    const result = processNoData({ fieldConfig: fieldConfigWithNoValue('80'), reverseColors: false, theme });

    expect(result.status).toBe(LIGHTS_DATA_RESULT_STATUSES.Success);
    expect(result.values[0].numericValue).toBe(80);
    // Value 80 falls in the third threshold step (green, value: 70)
    expect(result.values[0].colors[0].active).toBe(false);
    expect(result.values[0].colors[1].active).toBe(false);
    expect(result.values[0].colors[2].active).toBe(true);
  });

  it('should return IncorrectThresholds when thresholds are invalid', () => {
    const result = processNoData({
      fieldConfig: {
        defaults: {
          noValue: '50',
          thresholds: {
            mode: ThresholdsMode.Absolute,
            steps: [{ value: -Infinity, color: 'red' }],
          },
        },
        overrides: [],
      },
      reverseColors: false,
      theme,
    });

    expect(result.status).toBe(LIGHTS_DATA_RESULT_STATUSES.IncorrectThresholds);
  });

  it('should handle negative noValue correctly', () => {
    const result = processNoData({ fieldConfig: fieldConfigWithNoValue('-10'), reverseColors: false, theme });

    expect(result.status).toBe(LIGHTS_DATA_RESULT_STATUSES.Success);
    expect(result.values[0].numericValue).toBe(-10);
    // Value -10 falls in the first threshold step (red, value: -Infinity)
    expect(result.values[0].colors[0].active).toBe(true);
  });

  it('should handle decimal noValue correctly', () => {
    const result = processNoData({ fieldConfig: fieldConfigWithNoValue('50.5'), reverseColors: false, theme });

    expect(result.status).toBe(LIGHTS_DATA_RESULT_STATUSES.Success);
    expect(result.values[0].numericValue).toBe(50.5);
    // Value 50.5 falls in the second threshold step (orange, value: 40)
    expect(result.values[0].colors[1].active).toBe(true);
  });

  it('should reverse colors when reverseColors is true', () => {
    const result = processNoData({ fieldConfig: fieldConfigWithNoValue('0'), reverseColors: true, theme });

    expect(result.status).toBe(LIGHTS_DATA_RESULT_STATUSES.Success);
    // With reverseColors, the order is reversed: green, orange, red
    // Value 0 still matches threshold step with value -Infinity (red)
    // But in reversed array, that step is now at index 2
    expect(result.values[0].colors[0].active).toBe(false);
    expect(result.values[0].colors[1].active).toBe(false);
    expect(result.values[0].colors[2].active).toBe(true);
  });
});
