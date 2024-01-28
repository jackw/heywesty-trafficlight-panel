export enum SortOptions {
  None = 'none',
  Asc = 'ascending',
  Desc = 'descending',
}

export interface TrafficLightOptions {
  minLightWidth: number;
  showValue: boolean;
  showTrend: boolean;
  sortLights: SortOptions;
  horizontal: boolean;
  singleRow: boolean;
}
