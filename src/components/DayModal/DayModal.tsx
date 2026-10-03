import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Trash2, AlertTriangle, FileText, CheckCircle2, Clock, Sun, Moon } from 'lucide-react';
import { CalendarDayInfo } from '../../types';
import { formatCurrency, formatNumber } from '../../utils/calculations';
import { formatRussianLongDate } from '../../utils/dateUtils';

interface DayModalProps {
  day: CalendarDayInfo | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (dateKey: string, quantity: number, needsVerification: boolean, note: string) => void;
  onDelete: (dateKey: string) => void;
  pricePerItem: number;
}

export const DayModal: React.FC<DayModalProps> = ({
  day,
  isOpen,
  onClose,
  onSave,
  onDelete,
  pricePerItem,
}) => {
  const [quantityInput, setQuantityInput] = useState<string>('');
  const [needsVerification, setNeedsVerification] = useState<boolean>(false);
  const [note, setNote] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (day && isOpen) {
      if (day.entry && typeof day.entry.quantity === 'number' && day.entry.quantity > 0) {
        setQuantityInput(String(day.entry.quantity));
      } else {
        setQuantityInput('');
      }
      setNeedsVerification(Boolean(day.entry?.needsVerification));
      setNote(day.entry?.note || '');
      setErrorMessage(null);

      // Focus input on open
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [day, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !day) return null;

  // Numerical validation & live sum computation
  const parsedQuantity = quantityInput.trim() === '' ? 0 : parseInt(quantityInput.trim(), 10);
  const isValidInteger =
    quantityInput.trim() === '' ||
    (/^\d+$/.test(quantityInput.trim()) && !isNaN(parsedQuantity) && parsedQuantity >= 0);

  const calculatedSum = isValidInteger ? parsedQuantity * pricePerItem : 0;
  const hasExistingEntry = Boolean(day.entry && (day.entry.quantity > 0 || day.entry.note || day.entry.needsVerification));

  const handleQuickAdd = (amount: number) => {
    const current = isNaN(parsedQuantity) ? 0 : parsedQuantity;
    const nextVal = Math.max(0, current + amount);
    setQuantityInput(String(nextVal));
    setErrorMessage(null);
  };

  const handleSetPreset = (val: number) => {
    setQuantityInput(String(val));
    setErrorMessage(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidInteger) {
      setErrorMessage('Введите корректное целое неотрицательное число деталей.');
      return;
    }

    onSave(day.dateString, parsedQuantity, needsVerification, note.trim());
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Вы уверены, что хотите удалить сохранённые данные за этот день?')) {
      onDelete(day.dateString);
      onClose();
    }
  };

  const longDate = formatRussianLongDate(day.year, day.month, day.dayNumber);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      {/* Modal Dialog Card */}
      <div
        className="w-full max-w-lg rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-md border ${day.shift.badgeBg}`}
              >
                {day.shift.type === 'night' && <Moon className="w-3.5 h-3.5 text-blue-300 shrink-0" />}
                {day.shift.type === 'day' && <Sun className="w-3.5 h-3.5 text-orange-300 shrink-0" />}
                {day.shift.name}
              </span>
              {day.isToday && (
                <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Сегодня
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white capitalize">
              {longDate}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Закрыть (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-5 overflow-y-auto flex-1">
          {/* Note if scheduled rest / weekend day */}
          {!day.shift.isWorkShift && (
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                По плановому графику это <strong>{day.shift.name.toLowerCase()}</strong>. 
                Если вы выходили на подработку или сверхурочно — вы можете указать количество изготовленных деталей.
              </span>
            </div>
          )}

          {/* Quantity Input */}
          <div className="space-y-2">
            <label className="block text-xs sm:text-sm font-semibold text-slate-200">
              Количество изготовленных деталей (шт.)
            </label>

            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={quantityInput}
                onChange={(e) => {
                  setQuantityInput(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Например: 300"
                className={`w-full bg-slate-950 border ${
                  errorMessage ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-700 focus:border-indigo-500'
                } rounded-xl px-4 py-3 text-lg font-mono font-bold text-white placeholder-slate-600 focus:outline-none transition-colors`}
              />
              <span className="absolute right-4 top-3.5 text-xs font-sans text-slate-400 pointer-events-none">
                деталей
              </span>
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-400 mt-1">{errorMessage}</p>
            )}

            {/* Quick add buttons (great for mobile) */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 mr-1">Быстрый ввод:</span>
              {[100, 200, 300, 400].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleSetPreset(val)}
                  className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-xs font-mono text-slate-200 border border-slate-700 transition-colors"
                >
                  {val}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleQuickAdd(50)}
                className="px-2 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-mono border border-indigo-500/30 transition-colors"
              >
                +50
              </button>
              {quantityInput && (
                <button
                  type="button"
                  onClick={() => setQuantityInput('')}
                  className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-rose-300 text-xs transition-colors ml-auto"
                >
                  Очистить
                </button>
              )}
            </div>
          </div>

          {/* Automatic sum calculation display */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 to-indigo-950/40 border border-slate-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs text-slate-400 block">Рассчитанная сумма:</span>
              <span className="text-[11px] text-slate-500 font-mono">
                {formatNumber(isValidInteger ? parsedQuantity : 0)} шт. × {pricePerItem} ₽
              </span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
              {formatCurrency(calculatedSum)}
            </div>
          </div>

          {/* Needs Verification Toggle */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-950 transition-colors">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={needsVerification}
                onChange={(e) => setNeedsVerification(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-700 text-amber-500 focus:ring-amber-400 bg-slate-900 cursor-pointer accent-amber-500"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-200">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Нужно проверить (количество не подтверждено)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Отметьте этот пункт, если записали выработку приблизительно или хотите пересчитать детали позже. 
                  В календаре появится предупреждающий маркер ⚠️.
                </p>
              </div>
            </label>
          </div>

          {/* Note Input */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-200">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Заметка к смене</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Например: 'Была поломка станка, перепроверить партию №12'..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2 sm:justify-between border-t border-slate-800">
            {hasExistingEntry ? (
              <button
                type="button"
                onClick={handleDelete}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/50 transition-colors order-2 sm:order-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Удалить данные дня</span>
              </button>
            ) : (
              <div className="hidden sm:block order-1" />
            )}

            <div className="w-full sm:w-auto flex items-center gap-2 order-1 sm:order-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                Отмена
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all active:scale-[0.98]"
              >
                <Save className="w-4 h-4" />
                <span>Сохранить</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
