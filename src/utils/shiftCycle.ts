import { REFERENCE_DATE, SHIFT_CYCLE_TYPES, SHIFT_DEFINITIONS } from '../constants/config';
import { ShiftInfo } from '../types';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Вычисляет смену для заданной даты по 8-дневному циклу.
 * Точка отсчёта: 30 сентября 2026 = Ночная смена (индекс 0).
 * 
 * Вычисления производятся через Date.UTC, что полностью исключает
 * сдвиги из-за перехода на летнее/зимнее время или часовых поясов.
 */
export function getShiftForDate(year: number, month: number, day: number): ShiftInfo {
  // Вычисляем UTC-таймстемпы в полночь
  const refUtc = Date.UTC(REFERENCE_DATE.year, REFERENCE_DATE.month, REFERENCE_DATE.day);
  const targetUtc = Date.UTC(year, month, day);

  // Точное количество календарных дней между датами
  const diffDays = Math.round((targetUtc - refUtc) / MS_PER_DAY);

  // Корректный циклический индекс от 0 до 7 (работает и для отрицательных дат)
  const cycleIndex = ((diffDays % 8) + 8) % 8;

  const shiftType = SHIFT_CYCLE_TYPES[cycleIndex];
  const definition = SHIFT_DEFINITIONS[shiftType];

  return {
    ...definition,
    cycleIndex,
  };
}

/**
 * Проверка правильности расчёта на контрольных датах из технического задания:
 * 30.09.2026 = Ночная
 * 01.10.2026 = Ночная
 * 02.10.2026 = Отсыпной
 * 03.10.2026 = Выходной
 * 04.10.2026 = Дневная
 * 05.10.2026 = Дневная
 * 06.10.2026 = Выходной
 * 07.10.2026 = Выходной
 * 08.10.2026 = Ночная
 */
export function verifyShiftCycleRules(): { passed: boolean; details: string[] } {
  const tests = [
    { year: 2026, month: 8, day: 30, expected: 'night', label: '30.09.2026 (Ночная)' },
    { year: 2026, month: 9, day: 1, expected: 'night', label: '01.10.2026 (Ночная)' },
    { year: 2026, month: 9, day: 2, expected: 'rest', label: '02.10.2026 (Отсыпной)' },
    { year: 2026, month: 9, day: 3, expected: 'dayOff', label: '03.10.2026 (Выходной)' },
    { year: 2026, month: 9, day: 4, expected: 'day', label: '04.10.2026 (Дневная)' },
    { year: 2026, month: 9, day: 5, expected: 'day', label: '05.10.2026 (Дневная)' },
    { year: 2026, month: 9, day: 6, expected: 'dayOff', label: '06.10.2026 (Выходной)' },
    { year: 2026, month: 9, day: 7, expected: 'dayOff', label: '07.10.2026 (Выходной)' },
    { year: 2026, month: 9, day: 8, expected: 'night', label: '08.10.2026 (Ночная)' },
  ];

  const details: string[] = [];
  let allPassed = true;

  for (const test of tests) {
    const shift = getShiftForDate(test.year, test.month, test.day);
    const passed = shift.type === test.expected;
    if (!passed) allPassed = false;
    details.push(`${test.label}: ${passed ? '✓ УСПЕХ' : '✗ ОШИБКА (получено: ' + shift.type + ')'}`);
  }

  return { passed: allPassed, details };
}
