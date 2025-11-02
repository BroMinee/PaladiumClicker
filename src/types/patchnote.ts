export interface ChangeLogs {
  date: string,
  changes: ChangeLogsChanges,
}

export interface ChangeLogsChanges {
  [key: string]: Array<string> | undefined;
}

