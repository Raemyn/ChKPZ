import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header/Header';
import { CalendarHeader } from './components/Calendar/CalendarHeader';
import { Calendar } from './components/Calendar/Calendar';
import { ShiftLegend } from './components/ShiftLegend/ShiftLegend';
import { DayModal } from './components/DayModal/DayModal';
import { MonthSummaryModal } from './components/MonthSummary/MonthSummaryModal';
import { SettingsModal } from './components/SettingsModal/SettingsModal';
import { CalendarDayInfo, DayEntriesMap } from './types';
import { calculateMonthStatistics } from './utils/calculations';
import { 
  generateMonthCalendarDays, 
  getTodayDateKey, 
  parseDateKey,
  formatDateKey 
} from './utils/dateUtils';
import { getShiftForDate } from './utils/shiftCycle';
import { 
  deleteEntryForDate, 
  loadStoredEntries, 
  loadStoredPricePerItem, 
  saveEntryForDate 
} from './utils/storage';

export default function App() {
  // Current real date
  const today = useMemo(() => new Date(), []);
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth(); // 0-11

  // Navigation state (year and month currently viewed in the calendar)
  const [viewYear, setViewYear] = useState<number>(todayYear);
  const [viewMonth, setViewMonth] = useState<number>(todayMonth);

  // Stored data and settings
  const [entries, setEntries] = useState<DayEntriesMap>(() => loadStoredEntries());
  const [pricePerItem, setPricePerItem] = useState<number>(() => loadStoredPricePerItem());

  // Modals state
  const [selectedDay, setSelectedDay] = useState<CalendarDayInfo | null>(null);
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // Generate calendar grid for current view
  const calendarDays = useMemo(() => {
    return generateMonthCalendarDays(viewYear, viewMonth, entries, pricePerItem);
  }, [viewYear, viewMonth, entries, pricePerItem]);

  // Calculate statistics for currently selected month
  const monthStats = useMemo(() => {
    return calculateMonthStatistics(viewYear, viewMonth, entries, pricePerItem);
  }, [viewYear, viewMonth, entries, pricePerItem]);

  // Quick navigation handlers
  const handlePrevMonth = useCallback(() => {
    if (viewMonth === 0) {
      setViewYear((prev) => prev - 1);
      setViewMonth(11);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  }, [viewMonth]);

  const handleNextMonth = useCallback(() => {
    if (viewMonth === 11) {
      setViewYear((prev) => prev + 1);
      setViewMonth(0);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  }, [viewMonth]);

  const handlePrevYear = useCallback(() => {
    setViewYear((prev) => prev - 1);
  }, []);

  const handleNextYear = useCallback(() => {
    setViewYear((prev) => prev + 1);
  }, []);

  const handleGoToToday = useCallback(() => {
    setViewYear(todayYear);
    setViewMonth(todayMonth);
  }, [todayYear, todayMonth]);

  const isTodayMonth = viewYear === todayYear && viewMonth === todayMonth;

  // Day editing handlers
  const handleSelectDay = (day: CalendarDayInfo) => {
    setSelectedDay(day);
  };

  const handleSaveDay = (
    dateKey: string,
    quantity: number,
    needsVerification: boolean,
    note: string
  ) => {
    const updated = saveEntryForDate(dateKey, { quantity, needsVerification, note });
    setEntries(updated);
  };

  const handleDeleteDay = (dateKey: string) => {
    const updated = deleteEntryForDate(dateKey);
    setEntries(updated);
  };

  // Handler to open day modal directly from the unverified list in month summary
  const handleSelectDayToEdit = (dateKey: string) => {
    const { year, month, day } = parseDateKey(dateKey);
    // Navigate view to that month if different
    if (year !== viewYear || month !== viewMonth) {
      setViewYear(year);
      setViewMonth(month);
    }
    const targetDate = new Date(year, month, day);
    const shift = getShiftForDate(year, month, day);
    const entry = entries[dateKey];
    const earnings = entry && entry.quantity > 0 ? entry.quantity * pricePerItem : 0;
    const todayKey = getTodayDateKey();

    setSelectedDay({
      date: targetDate,
      dateString: dateKey,
      dayNumber: day,
      month,
      year,
      isCurrentMonth: true,
      isToday: dateKey === todayKey,
      shift,
      entry,
      earnings,
    });
  };

  const handleDataImported = () => {
    setEntries(loadStoredEntries());
    setPricePerItem(loadStoredPricePerItem());
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Application Header */}
      <Header
        currentMonthName={monthStats.monthName}
        currentYear={viewYear}
        currentMonthEarnings={monthStats.totalEarnings}
        onOpenSummary={() => setIsSummaryOpen(true)}
        onGoToToday={handleGoToToday}
        onOpenSettings={() => setIsSettingsOpen(true)}
        pricePerItem={pricePerItem}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
        {/* Calendar Navigation & Month Title Bar */}
        <CalendarHeader
          currentMonth={viewMonth}
          currentYear={viewYear}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onPrevYear={handlePrevYear}
          onNextYear={handleNextYear}
          onGoToToday={handleGoToToday}
          isTodayMonth={isTodayMonth}
          totalParts={monthStats.totalParts}
          totalEarnings={monthStats.totalEarnings}
          workDaysCount={monthStats.totalWorkDays}
          onOpenSummary={() => setIsSummaryOpen(true)}
        />

        {/* 7-column Calendar View */}
        <Calendar
          days={calendarDays}
          onSelectDay={handleSelectDay}
        />

        {/* Shift Legend & Cycle Information */}
        <ShiftLegend />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <p>Мои смены • Личный учёт выработки и график смен • Сохранение в браузере</p>
      </footer>

      {/* Day Edit Modal */}
      <DayModal
        day={selectedDay}
        isOpen={Boolean(selectedDay)}
        onClose={() => setSelectedDay(null)}
        onSave={handleSaveDay}
        onDelete={handleDeleteDay}
        pricePerItem={pricePerItem}
      />

      {/* Month Statistics Modal */}
      <MonthSummaryModal
        stats={monthStats}
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        onSelectDayToEdit={handleSelectDayToEdit}
        pricePerItem={pricePerItem}
      />

      {/* Settings & Backup Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        pricePerItem={pricePerItem}
        onUpdatePrice={setPricePerItem}
        onDataImported={handleDataImported}
      />
    </div>
  );
}
