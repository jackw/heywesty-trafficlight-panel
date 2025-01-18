import { LightsDataValues } from 'types';

import { basicTrend, calculateRowsAndColumns, sortByValue } from './utils';

describe('calculateRowsAndColumns', () => {
  it('should calculate the correct number of rows and columns', () => {
    const containerWidth = 1000;
    const itemWidth = 200;
    const itemCount = 5;

    const { rows, cols } = calculateRowsAndColumns(containerWidth, itemWidth, itemCount);
    expect(rows).toBe(1);
    expect(cols).toBe(5);
  });

  it('should handle zero itemCount', () => {
    const containerWidth = 1000;
    const itemWidth = 200;
    const itemCount = 0;

    const { rows, cols } = calculateRowsAndColumns(containerWidth, itemWidth, itemCount);

    expect(rows).toBe(0);
    expect(cols).toBe(0);
  });

  it('should handle containerWidth smaller than itemWidth', () => {
    const containerWidth = 100;
    const itemWidth = 200;
    const itemCount = 5;

    const { rows, cols } = calculateRowsAndColumns(containerWidth, itemWidth, itemCount);

    expect(rows).toBe(1);
    expect(cols).toBe(5);
  });
});

describe('basicTrend', () => {
  it('should return "1" when the data is increasing', () => {
    const data = [1, 2, 3, 4, 5];
    const result = basicTrend(data);
    expect(result).toBe(1);
  });

  it('should return "-1" when the data is decreasing', () => {
    const data = [5, 4, 3, 2, 1];
    const result = basicTrend(data);
    expect(result).toBe(-1);
  });

  it('should return "0" when the data is constant', () => {
    const data = [1, 1, 1, 1, 1];
    const result = basicTrend(data);
    expect(result).toBe(0);
  });

  it('should return "0" when the data is empty', () => {
    const data: number[] = [];
    const result = basicTrend(data);
    expect(result).toBe(0);
  });
});

describe('sortByValue', () => {
  const data: LightsDataValues[] = [
    {
      title: 'Light 1',
      value: '532',
      numericValue: 532,
      hasLinks: false,
      colors: [],
      trend: { color: 'red', value: 1 },
    },
    { title: 'Light 2', value: '9', numericValue: 9, hasLinks: false, colors: [], trend: { color: 'green', value: 1 } },
    {
      title: 'Light 3',
      value: '91',
      numericValue: 91,
      hasLinks: false,
      colors: [],
      trend: { color: 'yellow', value: 1 },
    },
    {
      title: 'Light 4',
      value: '524',
      numericValue: 524,
      hasLinks: false,
      colors: [],
      trend: { color: 'blue', value: 1 },
    },
    {
      title: 'Light 5',
      value: '8',
      numericValue: 8,
      hasLinks: false,
      colors: [],
      trend: { color: 'orange', value: 1 },
    },
    {
      title: 'Light 6',
      value: '6',
      numericValue: 6,
      hasLinks: false,
      colors: [],
      trend: { color: 'purple', value: 1 },
    },
  ];

  it('should sort by ascending numericValue', () => {
    const sorted = sortByValue(data, 'ascending');
    const numericValues = sorted.map((item) => item.numericValue);
    expect(numericValues).toEqual([6, 8, 9, 91, 524, 532]);
  });

  it('should sort by descending numericValue', () => {
    const sorted = sortByValue(data, 'descending');
    const numericValues = sorted.map((item) => item.numericValue);
    expect(numericValues).toEqual([532, 524, 91, 9, 8, 6]);
  });
});
