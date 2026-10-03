import React from 'react';
import { AlertTriangle, FileText, Moon, Sun } from 'lucide-react';
import { CalendarDayInfo } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/calculations';

interface CalendarDayProps {
  day: CalendarDayInfo;
  onClick: (day: CalendarDayInfo) => void;
}

export const CalendarDay: React.FC<CalendarDayProps> = ({ day, onClick }) => {
  const { dayNumber, isCurrentMonth, isToday, shift, entry, earnings } = day;
  const hasQuantity = entry && typeof entry.quantity === 'number' && entry.quantity > 0;
  const needsVerification = entry?.needsVerification;
  const hasNote = Boolean(entry?.note && entry.note.trim().length > 0);

  // Background and border styling based on shift type and current status
  let containerClasses = 'relative flex flex-col justify-between p-1.5 sm:p-2.5 rounded-xl border transition-all cursor-pointer select-none text-left min-h-[74px] sm:min-h-[96px] md:min-h-[105px] focus:outline-none focus:ring-2 focus:ring-indigo-500 ';

  if (!isCurrentMonth) {
    containerClasses += 'opacity-30 bg-slate-950/60 border-slate-900 text-slate-500 hover:opacity-75 ';
  } else {
    containerClasses += `${shift.bgColor} ${shift.borderColor} hover:shadow-lg `;
  }

  // Today visual highlight: distinct border & glow
  if (isToday) {
    containerClasses += ' ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-950 border-indigo-400/90 shadow-indigo-500/25 shadow-xl ';
  }

  return (
    <button
      type="button"
      onClick={() => onClick(day)}
      className={containerClasses}
      title={`${shift.name}${hasQuantity ? ` • ${entry?.quantity} шт. • ${formatCurrency(earnings)}` : ''}${needsVerification ? ' • (Требует проверки)' : ''}`}
    >
      {/* Top Row: Date number, Today badge, and Shift badge */}
      <div className="flex items-start justify-between w-full gap-1">
        <div className="flex items-center gap-1">
          <span
            className={`font-mono text-sm sm:text-base font-bold leading-none ${
              isToday
                ? 'text-indigo-300'
                : isCurrentMonth
                ? 'text-slate-100'
                : 'text-slate-500'
            }`}
          >
            {dayNumber}
          </span>

          {isToday && (
            <span className="hidden xl:inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-500 text-white leading-none">
              Сегодня
            </span>
          )}
        </div>

        {/* Shift Badge: Sun / Moon icon + Short on mobile, full on md+ */}
        <span
          className={`inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold px-1.5 py-0.5 rounded-md border leading-none tracking-tight ${shift.badgeBg}`}
        >
          {shift.type === 'night' && <Moon className="w-2.5 h-2.5 text-blue-300 shrink-0" />}
          {shift.type === 'day' && <Sun className="w-2.5 h-2.5 text-orange-300 shrink-0" />}
          {/* Mobile short badge (Н, Д, О, В) */}
          <span className="sm:hidden font-mono font-bold">{shift.shortName}</span>
          {/* Desktop full badge */}
          <span className="hidden sm:inline">{shift.badgeText}</span>
        </span>
      </div>

      {/* Middle/Bottom: Data area (quantity, earnings, icons) */}
      <div className="mt-1 flex flex-col justify-end w-full space-y-0.5">
        {hasQuantity ? (
          <div className="w-full">
            <div className="flex items-center justify-between text-[11px] sm:text-xs">
              <span className="font-mono font-bold text-white tracking-tight">
                {formatNumber(entry!.quantity)}
                <span className="text-[9px] sm:text-[10px] text-slate-400 ml-0.5 font-sans">
                  шт.
                </span>
              </span>
            </div>

            <div className="text-[10px] sm:text-[11px] font-mono font-semibold text-emerald-400 leading-tight">
              {formatCurrency(earnings)}
            </div>
          </div>
        ) : (
          <div className="h-4 sm:h-5" />
        )}

        {/* Status Indicators: Needs Verification (⚠) & Note (📝) */}
        <div className="flex items-center justify-between pt-0.5 min-h-[14px]">
          <div className="flex items-center gap-1">
            {needsVerification && (
              <span
                className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] sm:text-[10px] font-medium animate-pulse"
                title="Данные требуют проверки"
              >
                <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 shrink-0" />
                <span className="hidden lg:inline text-[9px]">Проверить</span>
              </span>
            )}
          </div>

          <div>
            {hasNote && (
              <span
                className="text-slate-400 hover:text-slate-200"
                title={entry?.note}
              >
                <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400" />
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};
