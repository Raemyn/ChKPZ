import { MONTH_NAMES_RU } from '../constants/config';
import { CalendarDayInfo, DayEntriesMap } from '../types';
import { getShiftForDate } from './shiftCycle';

/**
 * Форматирует компоненты даты в строку формата YYYY-MM-DD
 */
export function formatDateKey(year: number, month: number, day: number): string {
  const y = String(year);
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Парсит строку YYYY-MM-DD в компоненты даты { year, month, day }
 */
export function parseDateKey(dateKey: string): { year: number; month: number; day: number } {
  const [yearStr, monthStr, dayStr] = dateKey.split('-');
  return {
    year: parseInt(yearStr, 10),
    month: parseInt(monthStr, 10) - 1,
    day: parseInt(dayStr, 10),
  };
}

/**
 * Возвращает сегодняшнюю дату в формате YYYY-MM-DD в локальном времени
 */
export function getTodayDateKey(): string {
  const now = new Date();
  return formatDateKey(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Форматирует дату на русском языке (например: "Вторник, 6 октября 2026 г.")
 */
export function formatRussianLongDate(year: number, month: number, day: number): string {
  const date = new Date(year, month, day);
  return date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Форматирует дату коротко: "4 октября"
 */
export function formatRussianShortDate(year: number, month: number, day: number): string {
  const date = new Date(year, month, day);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  });
}

/**
 * Генерирует массив ячеек календаря для указанного месяца и года.
 * Недели начинаются с понедельника (Пн = 0, Вс = 6).
 * Заполняются дни предыдущего и следующего месяцев для ровной сетки.
 */
export function generateMonthCalendarDays(
  year: number,
  month: number,
  entries: DayEntriesMap,
  pricePerItem: number
): CalendarDayInfo[] {
  const todayKey = getTodayDateKey();
  const days: CalendarDayInfo[] = [];

  // Первый день месяца
  const firstDayOfMonth = new Date(year, month, 1);
  // Количество дней в текущем месяце
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // День недели первого дня месяца: в JS 0 - Вс, 1 - Пн ... 6 - Сб
  // Преобразуем: Пн = 0, Вт = 1 ... Вс = 6
  const jsDay = firstDayOfMonth.getDay();
  const startDayOfWeek = (jsDay + 6) % 7;

  // Дней в предыдущем месяце
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // 1. Заполняем остаток предыдущего месяца
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const prevDay = daysInPrevMonth - i;
    const prevMonthDate = new Date(year, month - 1, prevDay);
    const pYear = prevMonthDate.getFullYear();
    const pMonth = prevMonthDate.getMonth();
    const dateKey = formatDateKey(pYear, pMonth, prevDay);
    const shift = getShiftForDate(pYear, pMonth, prevDay);
    const entry = entries[dateKey];
    const earnings = entry && entry.quantity > 0 ? entry.quantity * pricePerItem : 0;

    days.push({
      date: prevMonthDate,
      dateString: dateKey,
      dayNumber: prevDay,
      month: pMonth,
      year: pYear,
      isCurrentMonth: false,
      isToday: dateKey === todayKey,
      shift,
      entry,
      earnings,
    });
  }

  // 2. Заполняем дни текущего месяца
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = formatDateKey(year, month, d);
    const shift = getShiftForDate(year, month, d);
    const entry = entries[dateKey];
    const earnings = entry && entry.quantity > 0 ? entry.quantity * pricePerItem : 0;

    days.push({
      date: new Date(year, month, d),
      dateString: dateKey,
      dayNumber: d,
      month,
      year,
      isCurrentMonth: true,
      isToday: dateKey === todayKey,
      shift,
      entry,
      earnings,
    });
  }

  // 3. Заполняем начало следующего месяца до полной сетки (кратной 7 дням, обычно 35 или 42 ячейки)
  const remainingCells = (7 - (days.length % 7)) % 7;
  for (let d = 1; d <= remainingCells; d++) {
    const nextMonthDate = new Date(year, month + 1, d);
    const nYear = nextMonthDate.getFullYear();
    const nMonth = nextMonthDate.getMonth();
    const dateKey = formatDateKey(nYear, nMonth, d);
    const shift = getShiftForDate(nYear, nMonth, d);
    const entry = entries[dateKey];
    const earnings = entry && entry.quantity > 0 ? entry.quantity * pricePerItem : 0;

    days.push({
      date: nextMonthDate,
      dateString: dateKey,
      dayNumber: d,
      month: nMonth,
      year: nYear,
      isCurrentMonth: false,
      isToday: dateKey === todayKey,
      shift,
      entry,
      earnings,
    });
  }

  return days;
}
