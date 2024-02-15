import { calculateRowsAndColumns, basicTrend } from './utils';

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
