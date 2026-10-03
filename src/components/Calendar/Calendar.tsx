import React from 'react';
import { WEEKDAY_NAMES_RU } from '../../constants/config';
import { CalendarDayInfo } from '../../types';
import { CalendarDay } from './CalendarDay';

interface CalendarProps {
  days: CalendarDayInfo[];
  onSelectDay: (day: CalendarDayInfo) => void;
}

export const Calendar: React.FC<CalendarProps> = ({ days, onSelectDay }) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-2 sm:p-4 shadow-xl">
      {/* Weekday headers: Пн, Вт, Ср, Чт, Пт, Сб, Вс */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
        {WEEKDAY_NAMES_RU.map((dayName, index) => {
          const isWeekend = index >= 5; // Сб and Вс
          return (
            <div
              key={dayName}
              className={`py-1 text-xs sm:text-sm font-semibold tracking-wider ${
                isWeekend ? 'text-indigo-400/90' : 'text-slate-400'
              }`}
            >
              {dayName}
            </div>
          );
        })}
      </div>

      {/* Calendar 7-column Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((day) => (
          <CalendarDay
            key={day.dateString}
            day={day}
            onClick={onSelectDay}
          />
        ))}
      </div>
    </div>
  );
};
