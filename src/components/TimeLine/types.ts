export interface TaskData {
  Task: string;
  Owner: string;
  Status: string;
  OriginalStartDate: string;
  ProjectedActualStartDate: string;
  OriginalCompletionDate: string;
  ProjectedActualCompletionDate: string;
  CompletionDateVariance: string;
}

export interface TaskHeaderProps {
  title: string;
  classname?: string;
  rowClassname?: string;
  key: keyof TaskData;
  onClick?: (row: TaskData) => void;
}

export type ChartDataPoint = {
  x: [number, number];
  y: string;
};

export interface TimeRanges {
  [key: string]: {
    min: number;
    max: number;
    format:
      | false
      | "millisecond"
      | "second"
      | "minute"
      | "hour"
      | "day"
      | "week"
      | "month"
      | "quarter"
      | "year"
      | undefined;
  };
}

export interface chartTimeProps {
  min: number;
  max: number;
  format:
    | false
    | "millisecond"
    | "second"
    | "minute"
    | "hour"
    | "day"
    | "week"
    | "month"
    | "quarter"
    | "year"
    | undefined;
}
