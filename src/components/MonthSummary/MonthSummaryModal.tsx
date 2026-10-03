import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Layers, 
  Sun, 
  Moon, 
  AlertTriangle, 
  FileText, 
  Copy, 
  Check, 
  ArrowUpRight,
  TrendingUp,
  Coins
} from 'lucide-react';
import { MonthStatistics, CalendarDayInfo } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/calculations';
import { formatRussianShortDate } from '../../utils/dateUtils';

interface MonthSummaryModalProps {
  stats: MonthStatistics;
  isOpen: boolean;
  onClose: () => void;
  onSelectDayToEdit: (dateKey: string) => void;
  pricePerItem: number;
}

export const MonthSummaryModal: React.FC<MonthSummaryModalProps> = ({
  stats,
  isOpen,
  onClose,
  onSelectDayToEdit,
  pricePerItem,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const {
    monthName,
    year,
    totalWorkDays,
    totalParts,
    totalEarnings,
    unverifiedDaysCount,
    unverifiedDays,
    breakdown,
  } = stats;

  const handleCopyReport = () => {
    let reportText = `📊 Отчёт о выработке за ${monthName} ${year} г.\n`;
    reportText += `• Ставка: ${pricePerItem} ₽ / деталь\n`;
    reportText += `• Учтено рабочих смен: ${totalWorkDays}\n`;
    reportText += `• Всего деталей: ${formatNumber(totalParts)} шт.\n`;
    reportText += `• Итоговая сумма: ${formatCurrency(totalEarnings)}\n\n`;

    reportText += `Детализация по сменам:\n`;
    reportText += `☀️ Дневные: ${breakdown.dayShifts.count} смен, ${formatNumber(breakdown.dayShifts.parts)} шт. (${formatCurrency(breakdown.dayShifts.earnings)})\n`;
    reportText += `🌙 Ночные: ${breakdown.nightShifts.count} смен, ${formatNumber(breakdown.nightShifts.parts)} шт. (${formatCurrency(breakdown.nightShifts.earnings)})\n`;
    if (breakdown.otherShifts.count > 0) {
      reportText += `🛠 Сверхурочные: ${breakdown.otherShifts.count} смен, ${formatNumber(breakdown.otherShifts.parts)} шт. (${formatCurrency(breakdown.otherShifts.earnings)})\n`;
    }

    if (unverifiedDays.length > 0) {
      reportText += `\n⚠️ Требуют проверки (${unverifiedDays.length} дн.):\n`;
      unverifiedDays.forEach((d) => {
        reportText += `  - ${d.dayNumber} ${monthName}: ${d.quantity} шт. ${d.note ? `("${d.note}")` : ''}\n`;
      });
    }

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-2xl rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="space-y-1">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              Сводный расчёт выработки
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              Статистика за {monthName} {year}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
          {/* Main 4 KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* Shifts Count */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">Учтено смен</span>
              <div className="mt-2 text-2xl font-mono font-bold text-white">
                {totalWorkDays}
              </div>
              <span className="text-[10px] text-slate-500 mt-1">рабочих смен</span>
            </div>

            {/* Total Parts */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">Всего деталей</span>
              <div className="mt-2 text-2xl font-mono font-bold text-indigo-300">
                {formatNumber(totalParts)}
              </div>
              <span className="text-[10px] text-slate-500 mt-1">изготовлено шт.</span>
            </div>

            {/* Total Sum */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-indigo-950/50 to-emerald-950/30 border border-indigo-500/30 flex flex-col justify-between col-span-2 sm:col-span-1 shadow-lg shadow-indigo-950/20">
              <span className="text-xs text-indigo-300 font-medium">Итоговая сумма</span>
              <div className="mt-2 text-2xl font-mono font-bold text-emerald-400">
                {formatCurrency(totalEarnings)}
              </div>
              <span className="text-[10px] text-slate-400 mt-1">по ставке {pricePerItem} ₽</span>
            </div>

            {/* Needs Verification */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
              <span className="text-xs text-slate-400 font-medium">Требуют проверки</span>
              <div className="mt-2 text-2xl font-mono font-bold text-amber-400 flex items-center gap-1.5">
                {unverifiedDaysCount > 0 && <AlertTriangle className="w-5 h-5 shrink-0" />}
                <span>{unverifiedDaysCount}</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1">
                {unverifiedDaysCount === 1 ? '1 день' : `${unverifiedDaysCount} дня(ей)`}
              </span>
            </div>
          </div>

          {/* Breakdown Section: Day vs Night shifts */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Детализация по типам смен
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Day Shifts Card */}
              <div className="p-4 rounded-xl bg-orange-950/25 border border-orange-800/35 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-orange-300 font-semibold text-sm">
                    <Sun className="w-4 h-4 text-orange-400" />
                    <span>Дневные смены</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    {breakdown.dayShifts.count} смен
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-2 border-t border-orange-900/30 text-xs">
                  <span className="text-slate-400">Деталей:</span>
                  <span className="font-mono font-bold text-white">
                    {formatNumber(breakdown.dayShifts.parts)} шт.
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-400">Сумма:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {formatCurrency(breakdown.dayShifts.earnings)}
                  </span>
                </div>
              </div>

              {/* Night Shifts Card */}
              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-blue-300 font-semibold text-sm">
                    <Moon className="w-4 h-4 text-blue-400" />
                    <span>Ночные смены</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {breakdown.nightShifts.count} смен
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-2 border-t border-blue-900/30 text-xs">
                  <span className="text-slate-400">Деталей:</span>
                  <span className="font-mono font-bold text-white">
                    {formatNumber(breakdown.nightShifts.parts)} шт.
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-slate-400">Сумма:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {formatCurrency(breakdown.nightShifts.earnings)}
                  </span>
                </div>
              </div>

              {/* Extra overtime / weekend work if recorded */}
              {breakdown.otherShifts.count > 0 && (
                <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-800/40 space-y-2 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-300 font-semibold text-sm">
                      Сверхурочные / Выходные смены
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {breakdown.otherShifts.count} смен
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-2 border-t border-emerald-900/30 text-xs">
                    <span className="text-slate-400">Деталей:</span>
                    <span className="font-mono font-bold text-white">
                      {formatNumber(breakdown.otherShifts.parts)} шт.
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-400">Сумма:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {formatCurrency(breakdown.otherShifts.earnings)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* List of days requiring verification (Requirement 11) */}
          {unverifiedDays.length > 0 ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Дни, требующие проверки ({unverifiedDays.length})
                </h4>
                <span className="text-[11px] text-slate-500">
                  Нажмите на строку для перехода к редактированию
                </span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {unverifiedDays.map((item) => (
                  <button
                    key={item.dateString}
                    onClick={() => {
                      onClose();
                      onSelectDayToEdit(item.dateString);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 hover:bg-amber-900/30 transition-all flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-xs sm:text-sm">
                          {item.dayNumber} {monthName}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded border ${item.shift.badgeBg}`}>
                          {item.shift.name}
                        </span>
                      </div>
                      {item.note && (
                        <p className="text-[11px] text-amber-200/90 italic flex items-center gap-1">
                          <FileText className="w-3 h-3 shrink-0" />
                          <span>«{item.note}»</span>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs font-mono font-bold text-white">
                          {item.quantity} шт.
                        </div>
                        <div className="text-[10px] font-mono text-emerald-400">
                          {formatCurrency(item.earnings)}
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-800/30 text-xs text-emerald-300 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Все внесённые данные подтверждены. Дней, требующих проверки, нет!</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleCopyReport}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Отчёт скопирован в буфер!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-indigo-400" />
                <span>Скопировать отчёт текстом</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
