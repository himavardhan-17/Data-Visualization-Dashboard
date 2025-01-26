export interface DataPoint {
  [key: string]: string | number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    fill?: boolean;
  }[];
}

export interface ColumnSelection {
  xAxis: string;
  yAxis: string;
  groupBy?: string;
}