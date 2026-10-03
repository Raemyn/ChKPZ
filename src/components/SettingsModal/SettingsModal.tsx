import React, { useState, useRef } from 'react';
import { X, Check, Save, Download, Upload, ShieldCheck, Trash2, Coins } from 'lucide-react';
import { DEFAULT_PRICE_PER_ITEM } from '../../constants/config';
import { verifyShiftCycleRules } from '../../utils/shiftCycle';
import { exportDataAsJson, importDataFromJson, saveStoredPricePerItem } from '../../utils/storage';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pricePerItem: number;
  onUpdatePrice: (newPrice: number) => void;
  onDataImported: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  pricePerItem,
  onUpdatePrice,
  onDataImported,
}) => {
  const [priceInput, setPriceInput] = useState(String(pricePerItem));
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const testResults = verifyShiftCycleRules();

  const handleSavePrice = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(priceInput.replace(',', '.'));
    if (!isNaN(parsed) && parsed > 0) {
      saveStoredPricePerItem(parsed);
      onUpdatePrice(parsed);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  const handleResetDefaultPrice = () => {
    setPriceInput(String(DEFAULT_PRICE_PER_ITEM));
    saveStoredPricePerItem(DEFAULT_PRICE_PER_ITEM);
    onUpdatePrice(DEFAULT_PRICE_PER_ITEM);
  };

  const handleExport = () => {
    const jsonStr = exportDataAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-shifts-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const result = importDataFromJson(content);
        if (result.success) {
          setImportStatus('Данные успешно импортированы!');
          onDataImported();
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus(`Ошибка: ${result.error}`);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-lg rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white">Параметры и данные</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-6 overflow-y-auto flex-1 text-slate-300">
          {/* Rate setting */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Ставка оплаты за деталь
            </h4>
            <form onSubmit={handleSavePrice} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 font-mono text-white text-sm focus:outline-none focus:border-indigo-500"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400">
                  ₽ / деталь
                </span>
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Сохранить</span>
              </button>
            </form>

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>По умолчанию ставка равна {DEFAULT_PRICE_PER_ITEM} ₽</span>
              {pricePerItem !== DEFAULT_PRICE_PER_ITEM && (
                <button
                  type="button"
                  onClick={handleResetDefaultPrice}
                  className="text-indigo-400 hover:underline"
                >
                  Вернуть {DEFAULT_PRICE_PER_ITEM} ₽
                </button>
              )}
            </div>

            {savedSuccess && (
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Новая ставка сохранена!</span>
              </p>
            )}
          </div>

          {/* Backup & Restore */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Резервная копия данных (localStorage)
            </h4>
            <p className="text-xs text-slate-400">
              Все данные сохраняются в вашем браузере. Вы можете выгрузить файл резервной копии или перенести его на другое устройство.
            </p>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Скачать резервную копию</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-400" />
                <span>Загрузить из файла</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {importStatus && (
              <p className="text-xs font-medium text-indigo-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                {importStatus}
              </p>
            )}
          </div>

          {/* Cycle rule diagnostics */}
          <div className="space-y-2 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Проверка математики рабочего цикла</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono space-y-1">
              <div className="text-emerald-400 font-bold mb-1">
                {testResults.passed ? '✓ Все 9 контрольных дат совпадают с ТЗ' : '✗ Есть расхождения'}
              </div>
              {testResults.details.map((item, idx) => (
                <div key={idx} className="text-slate-400">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
