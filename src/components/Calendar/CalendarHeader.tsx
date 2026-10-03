import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Calendar, Sparkles } from 'lucide-react';
import { MONTH_NAMES_RU } from '../../constants/config';
import { formatCurrency, formatNumber } from '../../utils/calculations';

interface CalendarHeaderProps {
  currentMonth: number; // 0-11
  currentYear: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onPrevYear: () => void;
  onNextYear: () => void;
  onGoToToday: () => void;
  isTodayMonth: boolean;
  totalParts: number;
  totalEarnings: number;
  workDaysCount: number;
  onOpenSummary: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentMonth,
  currentYear,
  onPrevMonth,
  onNextMonth,
  onPrevYear,
  onNextYear,
  onGoToToday,
  isTodayMonth,
  totalParts,
  totalEarnings,
  workDaysCount,
  onOpenSummary,
}) => {
  const monthName = MONTH_NAMES_RU[currentMonth];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
      {/* Navigation Buttons & Month Display */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Year prev */}
        <button
          onClick={onPrevYear}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          title="Предыдущий год"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Month prev */}
        <button
          onClick={onPrevMonth}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          title="Предыдущий месяц"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Month and Year title */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 shadow-inner">
          <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight select-none">
            {monthName} <span className="text-indigo-400 font-mono">{currentYear}</span>
          </h2>
        </div>

        {/* Month next */}
        <button
          onClick={onNextMonth}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          title="Следующий месяц"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Year next */}
        <button
          onClick={onNextYear}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
          title="Следующий год"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>

        {/* Back to current month if navigated away */}
        {!isTodayMonth && (
          <button
            onClick={onGoToToday}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors font-medium whitespace-nowrap"
          >
            Текущий
          </button>
        )}
      </div>

      {/* Mini month stats banner on the right */}
      {workDaysCount > 0 ? (
        <button
          onClick={onOpenSummary}
          className="group flex items-center justify-between sm:justify-end gap-3 px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-850 transition-all text-xs text-left"
          title="Нажмите для открытия подробной статистики"
        >
          <div className="flex items-center gap-2 text-slate-300">
            <Sparkles className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span>
              Смен: <strong className="text-white font-mono">{workDaysCount}</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span>
              Деталей: <strong className="text-white font-mono">{formatNumber(totalParts)}</strong> шт.
            </span>
          </div>
          <div className="text-emerald-400 font-bold font-mono pl-2 border-l border-slate-800">
            {formatCurrency(totalEarnings)}
          </div>
        </button>
      ) : (
        <div className="text-xs text-slate-500 italic hidden sm:block">
          Нажмите на любой день для ввода выработки
        </div>
      )}
    </div>
  );
};
