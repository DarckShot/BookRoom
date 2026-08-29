export interface RoomFilterValues {
  date: string;
  startTime: string;
  durationMinutes: number;
  minCapacity: number;
}

export interface RoomFiltersController {
  state: {
    values: RoomFilterValues;
    isDisabled: boolean;
  };
  actions: {
    setDate: (value: string) => void;
    setStartTime: (value: string) => void;
    setDuration: (value: string) => void;
    setMinCapacity: (value: string) => void;
    reset: () => void;
  };
  meta: {
    minDate: string;
    maxDate: string;
    latestStartTime: string;
  };
}

export interface RoomFilterIntervalInput {
  date: string;
  startTime: string;
  durationMinutes: number;
  timeZone: string;
}
