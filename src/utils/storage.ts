import { DEFAULT_PRICE_PER_ITEM, STORAGE_KEYS } from '../constants/config';
import { DayEntriesMap, DayEntry } from '../types';

/**
 * Загружает все сохраненные записи смен из localStorage.
 */
export function loadStoredEntries(): DayEntriesMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed as DayEntriesMap;
    }
    return {};
  } catch (err) {
    console.error('Ошибка при чтении записей из localStorage:', err);
    return {};
  }
}

/**
 * Сохраняет полную карту записей смен в localStorage.
 */
export function saveAllEntries(entries: DayEntriesMap): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
  } catch (err) {
    console.error('Ошибка при записи данных в localStorage:', err);
  }
}

/**
 * Сохраняет или обновляет запись для конкретной даты.
 */
export function saveEntryForDate(
  dateKey: string,
  entry: { quantity: number; needsVerification: boolean; note: string }
): DayEntriesMap {
  const current = loadStoredEntries();
  const updated: DayEntriesMap = {
    ...current,
    [dateKey]: {
      ...entry,
      updatedAt: new Date().toISOString(),
    },
  };
  saveAllEntries(updated);
  return updated;
}

/**
 * Удаляет запись для конкретной даты.
 */
export function deleteEntryForDate(dateKey: string): DayEntriesMap {
  const current = loadStoredEntries();
  const updated = { ...current };
  delete updated[dateKey];
  saveAllEntries(updated);
  return updated;
}

/**
 * Загружает ставку за деталь из localStorage (по умолчанию 16).
 */
export function loadStoredPricePerItem(): number {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.PRICE);
    if (val !== null) {
      const parsed = parseFloat(val);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Ошибка при чтении ставки из localStorage:', err);
  }
  return DEFAULT_PRICE_PER_ITEM;
}

/**
 * Сохраняет пользовательскую ставку за деталь в localStorage.
 */
export function saveStoredPricePerItem(price: number): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRICE, String(price));
  } catch (err) {
    console.error('Ошибка при сохранении ставки в localStorage:', err);
  }
}

/**
 * Экспорт всех данных в строку JSON (для резервной копии).
 */
export function exportDataAsJson(): string {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    pricePerItem: loadStoredPricePerItem(),
    entries: loadStoredEntries(),
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Импорт данных из строки JSON.
 */
export function importDataFromJson(jsonStr: string): { success: boolean; error?: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!parsed || typeof parsed !== 'object') {
      return { success: false, error: 'Неверный формат файла' };
    }
    if (parsed.entries && typeof parsed.entries === 'object') {
      saveAllEntries(parsed.entries);
    }
    if (typeof parsed.pricePerItem === 'number' && parsed.pricePerItem > 0) {
      saveStoredPricePerItem(parsed.pricePerItem);
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: 'Ошибка разбора JSON: ' + (err instanceof Error ? err.message : String(err)) };
  }
}
