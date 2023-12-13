export function basicTrend(data?: number[]) {
  const diff: {
    increasing: number[];
    decreasing: number[];
    equals: number[];
  } = {
    increasing: [],
    decreasing: [],
    equals: [],
  };
  if (data === undefined) {
    return 0;
  }

  data.map(function (item, index, array) {
    if (index > 0) {
      const difference = item - array[index - 1];
      if (difference === 0) {
        diff.equals.push(difference);
      } else if (difference > 0) {
        diff.increasing.push(difference);
      } else {
        diff.decreasing.push(difference);
      }
    }
    return item;
  });

  const increasingLength = diff.increasing.length;
  const decreasingLength = diff.decreasing.length;
  const equalsLength = diff.equals.length;

  if (increasingLength > decreasingLength + equalsLength) {
    return 1;
  }
  if (decreasingLength > increasingLength + equalsLength) {
    return -1;
  }
  if (equalsLength > increasingLength + decreasingLength) {
    return 0;
  }
  return 0;
}

export function calculateRowsAndColumns(containerWidth: number, itemWidth: number, itemCount: number) {
  const itemsPerRow = Math.floor(containerWidth / itemWidth);
  const rows = Math.ceil(itemCount / itemsPerRow);
  const cols = Math.ceil(itemCount / rows);

  return { rows, cols };
}
