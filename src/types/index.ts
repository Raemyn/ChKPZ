export type ShiftType = 'night' | 'rest' | 'dayOff' | 'day';

export interface ShiftInfo {
  type: ShiftType;
  name: string;
  shortName: string;
  cycleIndex: number; // 0 to 7
  isWorkShift: boolean; // true for night and day
  bgColor: string;
  borderColor: string;
  textColor: string;
  badgeBg: string;
  badgeText: string;
  dotColor: string;
}

export interface DayEntry {
  quantity: number;
  needsVerification: boolean;
  note: string;
  updatedAt?: string;
}

export type DayEntriesMap = Record<string, DayEntry>;

export interface CalendarDayInfo {
  date: Date;
  dateString: string; // YYYY-MM-DD
  dayNumber: number;
  month: number; // 0-11
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  shift: ShiftInfo;
  entry?: DayEntry;
  earnings: number;
}

export interface MonthStatistics {
  monthName: string;
  year: number;
  totalWorkDays: number;
  totalParts: number;
  totalEarnings: number;
  unverifiedDaysCount: number;
  unverifiedDays: Array<{
    dateString: string;
    dayNumber: number;
    shift: ShiftInfo;
    quantity: number;
    earnings: number;
    note: string;
  }>;
  breakdown: {
    dayShifts: {
      count: number;
      parts: number;
      earnings: number;
    };
    nightShifts: {
      count: number;
      parts: number;
      earnings: number;
    };
    otherShifts: {
      count: number;
      parts: number;
      earnings: number;
    };
  };
}
