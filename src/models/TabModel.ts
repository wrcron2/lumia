

export enum TimeRangeTab {
  Last7Days = 1,
  Last30Days,
  AllTime 
}


export const TimeRangeTabMap: Record<TimeRangeTab, string> = {
    [TimeRangeTab.Last7Days]: "Last 7 Days",
    [TimeRangeTab.Last30Days]: "Last 30 Days",
    [TimeRangeTab.AllTime]: "All Time"
  };