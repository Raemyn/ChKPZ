import React, { useState } from 'react';
import { Info, AlertTriangle, FileText, ChevronDown, ChevronUp, Sun, Moon } from 'lucide-react';
import { SHIFT_DEFINITIONS } from '../../constants/config';
import { ShiftType } from '../../types';

export const ShiftLegend: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const legendItems: Array<{ 
    type: ShiftType; 
    label: string; 
    short: string; 
    icon?: React.ReactNode; 
    desc: string 
  }> = [
    {
      type: 'day',
      label: 'Дневная',
      short: 'Д',
      icon: <Sun className="w-3.5 h-3.5 text-orange-400 shrink-0" />,
      desc: 'Оранжевая смена со значком солнца',
    },
    {
      type: 'night',
      label: 'Ночная',
      short: 'Н',
      icon: <Moon className="w-3.5 h-3.5 text-blue-400 shrink-0" />,
      desc: 'Синяя смена со значком луны',
    },
    {
      type: 'rest',
      label: 'Отсыпной',
      short: 'О',
      desc: 'Тёмно-зелёный день отдыха после ночных смен',
    },
    {
      type: 'dayOff',
      label: 'Выходной',
      short: 'В',
      desc: 'Зелёный плановый выходной день',
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-3 sm:p-4 text-xs">
      <div className="flex items-center justify-between gap-2">
        {/* Chips for shift types */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-slate-400 font-medium hidden sm:inline">Смены:</span>
          {legendItems.map((item) => {
            const def = SHIFT_DEFINITIONS[item.type];
            return (
              <div
                key={item.type}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60"
              >
                {item.icon ? (
                  item.icon
                ) : (
                  <span className={`w-2.5 h-2.5 rounded-full ${def.dotColor} shrink-0`} />
                )}
                <span className="font-semibold text-slate-200">{item.label}</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-slate-700/70 text-slate-300 font-mono">
                  {item.short}
                </span>
              </div>
            );
          })}
        </div>

        {/* Toggle info button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 rounded-md hover:bg-slate-800/60 transition-colors shrink-0"
        >
          <Info className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">О графике и значках</span>
          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Expandable details */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-300 animate-fadeIn">
          <div className="space-y-1">
            <span className="font-semibold text-white block">Постоянный 8-дневный цикл смен:</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              1. Ночная → 2. Ночная → 3. Отсыпной → 4. Выходной → 5. Дневная → 6. Дневная → 7. Выходной → 8. Выходной.
              <br />
              Точка отсчёта: <span className="text-indigo-300 font-mono">30.09.2026</span> (первая ночная смена).
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="font-semibold text-white block">Особые отметки в календаре:</span>
            <div className="flex flex-wrap gap-3 text-[11px] text-slate-400">
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Жёлтый значок ⚠️ — данные требуют проверки</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                <span>Иконка 📝 — есть пользовательская заметка</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full border-2 border-indigo-400 inline-block" />
                <span>Фиолетовая рамка — реальный сегодняшний день</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
