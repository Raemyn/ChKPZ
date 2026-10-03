import { ShiftInfo, ShiftType } from '../types';

/**
 * Базовая ставка за одну изготовленную деталь.
 * Вынесена в константу для простоты изменения или переопределения.
 */
export const DEFAULT_PRICE_PER_ITEM = 16;

/**
 * Точка отсчёта рабочего цикла:
 * 30 сентября 2026 года — первая НОЧНАЯ смена (индекс 0 в 8-дневном цикле).
 */
export const REFERENCE_DATE = {
  year: 2026,
  month: 8, // 0-indexed: 8 = Сентябрь
  day: 30,
  dateString: '2026-09-30',
};

/**
 * Описание 8-дневного цикла:
 * 1. Ночная
 * 2. Ночная
 * 3. Отсыпной
 * 4. Выходной
 * 5. Дневная
 * 6. Дневная
 * 7. Выходной
 * 8. Выходной
 */
export const SHIFT_CYCLE_TYPES: ShiftType[] = [
  'night',  // 0: 30 сен — Ночная
  'night',  // 1: 1 окт — Ночная
  'rest',   // 2: 2 окт — Отсыпной
  'dayOff', // 3: 3 окт — Выходной
  'day',    // 4: 4 окт — Дневная
  'day',    // 5: 5 окт — Дневная
  'dayOff', // 6: 6 окт — Выходной
  'dayOff', // 7: 7 окт — Выходной
];

/**
 * Визуальное и смысловое описание каждого типа смены
 */
export const SHIFT_DEFINITIONS: Record<ShiftType, Omit<ShiftInfo, 'cycleIndex'>> = {
  night: {
    type: 'night',
    name: 'Ночная смена',
    shortName: 'Н',
    isWorkShift: true,
    bgColor: 'bg-blue-950/40 hover:bg-blue-900/50',
    borderColor: 'border-blue-600/50',
    textColor: 'text-blue-200',
    badgeBg: 'bg-blue-600/25 text-blue-200 border-blue-500/40',
    badgeText: 'Ночная',
    dotColor: 'bg-blue-400',
  },
  day: {
    type: 'day',
    name: 'Дневная смена',
    shortName: 'Д',
    isWorkShift: true,
    bgColor: 'bg-orange-950/40 hover:bg-orange-900/50',
    borderColor: 'border-orange-600/50',
    textColor: 'text-orange-200',
    badgeBg: 'bg-orange-500/25 text-orange-200 border-orange-500/40',
    badgeText: 'Дневная',
    dotColor: 'bg-orange-400',
  },
  rest: {
    type: 'rest',
    name: 'Отсыпной день',
    shortName: 'О',
    isWorkShift: false,
    bgColor: 'bg-teal-950/60 hover:bg-teal-900/70',
    borderColor: 'border-teal-700/60',
    textColor: 'text-teal-200',
    badgeBg: 'bg-teal-900/70 text-teal-300 border-teal-600/50',
    badgeText: 'Отсыпной',
    dotColor: 'bg-teal-400',
  },
  dayOff: {
    type: 'dayOff',
    name: 'Выходной день',
    shortName: 'В',
    isWorkShift: false,
    bgColor: 'bg-emerald-950/45 hover:bg-emerald-900/55',
    borderColor: 'border-emerald-600/45',
    textColor: 'text-emerald-200',
    badgeBg: 'bg-emerald-600/25 text-emerald-300 border-emerald-500/40',
    badgeText: 'Выходной',
    dotColor: 'bg-emerald-400',
  },
};

export const WEEKDAY_NAMES_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export const MONTH_NAMES_RU = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

export const STORAGE_KEYS = {
  ENTRIES: 'my_shifts_entries_v1',
  PRICE: 'my_shifts_price_v1',
};
