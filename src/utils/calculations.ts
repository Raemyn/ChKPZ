import { MONTH_NAMES_RU } from '../constants/config';
import { DayEntriesMap, MonthStatistics } from '../types';
import { formatDateKey } from './dateUtils';
import { getShiftForDate } from './shiftCycle';

/**
 * Красиво форматирует число с разделителями тысяч по стандарту ru-RU.
 * Например: 4800 -> "4 800", 123456 -> "123 456"
 */
export function formatNumber(num: number): string {
  if (isNaN(num) || num === null || num === undefined) return '0';
  return num.toLocaleString('ru-RU');
}

/**
 * Форматирует сумму в рублях.
 * Например: 4800 -> "4 800 ₽"
 */
export function formatCurrency(num: number): string {
  return `${formatNumber(num)} ₽`;
}

/**
 * Рассчитывает подробную статистику по указанному месяцу.
 * Учитываются только дни, в которые пользователь фактически ввёл выработку (quantity > 0).
 * Будущие или незаполненные дни не придумываются и не включаются в расчёт.
 */
export function calculateMonthStatistics(
  year: number,
  month: number,
  entries: DayEntriesMap,
  pricePerItem: number
): MonthStatistics {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = MONTH_NAMES_RU[month];

  let totalWorkDays = 0;
  let totalParts = 0;
  let totalEarnings = 0;

  const breakdown = {
    dayShifts: { count: 0, parts: 0, earnings: 0 },
    nightShifts: { count: 0, parts: 0, earnings: 0 },
    otherShifts: { count: 0, parts: 0, earnings: 0 },
  };

  const unverifiedDays: MonthStatistics['unverifiedDays'] = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = formatDateKey(year, month, d);
    const entry = entries[dateKey];
    const shift = getShiftForDate(year, month, d);

    // Учитываем день, если пользователь сохранил запись с количеством деталей > 0
    if (entry && typeof entry.quantity === 'number' && entry.quantity > 0) {
      const parts = entry.quantity;
      const earnings = parts * pricePerItem;

      totalWorkDays += 1;
      totalParts += parts;
      totalEarnings += earnings;

      if (shift.type === 'day') {
        breakdown.dayShifts.count += 1;
        breakdown.dayShifts.parts += parts;
        breakdown.dayShifts.earnings += earnings;
      } else if (shift.type === 'night') {
        breakdown.nightShifts.count += 1;
        breakdown.nightShifts.parts += parts;
        breakdown.nightShifts.earnings += earnings;
      } else {
        // Выходной или отсыпной день, в который пользователь работал сверхурочно
        breakdown.otherShifts.count += 1;
        breakdown.otherShifts.parts += parts;
        breakdown.otherShifts.earnings += earnings;
      }

      // Проверка на флаг "Нужно проверить"
      if (entry.needsVerification) {
        unverifiedDays.push({
          dateString: dateKey,
          dayNumber: d,
          shift,
          quantity: parts,
          earnings,
          note: entry.note || '',
        });
      }
    } else if (entry && entry.needsVerification) {
      // Даже если деталей 0 или не указаны, но стоит пометка "Нужно проверить"
      unverifiedDays.push({
        dateString: dateKey,
        dayNumber: d,
        shift,
        quantity: entry.quantity || 0,
        earnings: (entry.quantity || 0) * pricePerItem,
        note: entry.note || '',
      });
    }
  }

  return {
    monthName,
    year,
    totalWorkDays,
    totalParts,
    totalEarnings,
    unverifiedDaysCount: unverifiedDays.length,
    unverifiedDays,
    breakdown,
  };
}
