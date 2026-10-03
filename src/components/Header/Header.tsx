import React from 'react';
import { Calendar as CalendarIcon, Calculator, RotateCcw, Settings, Clock } from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';

interface HeaderProps {
  currentMonthName: string;
  currentYear: number;
  currentMonthEarnings: number;
  onOpenSummary: () => void;
  onGoToToday: () => void;
  onOpenSettings: () => void;
  pricePerItem: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentMonthName,
  currentYear,
  currentMonthEarnings,
  onOpenSummary,
  onGoToToday,
  onOpenSettings,
  pricePerItem,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Logo & App Title */}
          <div className="flex items-center justify-between sm:justify-start gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  Мои смены
                  <span className="hidden md:inline-flex text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                    {pricePerItem} ₽ / деталь
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Календарь смен и учёт выработки
                </p>
              </div>
            </div>

            {/* Quick action buttons for mobile top bar */}
            <div className="flex items-center gap-1.5 sm:hidden">
              <button
                onClick={onGoToToday}
                className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 active:bg-slate-700 text-xs"
                title="Перейти к сегодняшнему дню"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenSettings}
                className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 active:bg-slate-700 text-xs"
                title="Настройки ставки и резервное копирование"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action buttons (desktop & tablet) */}
          <div className="flex items-center gap-2 sm:gap-3 justify-between sm:justify-end">
            <button
              onClick={onGoToToday}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800/90 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 transition-all hover:border-slate-600"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Сегодня</span>
            </button>

            {/* Prominent "Рассчитать месяц" button */}
            <button
              onClick={onOpenSummary}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/25 border border-indigo-400/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <Calculator className="w-4 h-4 text-indigo-200" />
              <span>Рассчитать месяц</span>
              {currentMonthEarnings > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-white font-mono text-xs">
                  {formatCurrency(currentMonthEarnings)}
                </span>
              )}
            </button>

            <button
              onClick={onOpenSettings}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800/90 hover:bg-slate-700/80 text-slate-200 border border-slate-700/80 transition-all hover:border-slate-600"
              title="Настройки ставки и данных"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>{pricePerItem} ₽/шт</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
