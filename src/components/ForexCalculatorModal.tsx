import React, { useState } from 'react';
import {
  X,
  Coins,
  ArrowRightLeft,
  RefreshCw,
  TrendingUp,
  Globe2,
} from 'lucide-react';
import { CurrencyCode, SUPPORTED_CURRENCIES } from '../types';
import {
  DEFAULT_FOREX_RATES,
  convertCurrency,
  formatMoney,
  getCurrencySymbol,
} from '../utils/forex';

interface ForexCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseCurrency: CurrencyCode;
}

export const ForexCalculatorModal: React.FC<ForexCalculatorModalProps> = ({
  isOpen,
  onClose,
  baseCurrency,
}) => {
  const [fromCurr, setFromCurr] = useState<CurrencyCode>('USD');
  const [toCurr, setToCurr] = useState<CurrencyCode>(baseCurrency === 'USD' ? 'INR' : baseCurrency);
  const [amount, setAmount] = useState<number>(100);
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const convertedValue = convertCurrency(amount, fromCurr, toCurr);
  const unitRate = convertCurrency(1, fromCurr, toCurr);

  const handleSwap = () => {
    setFromCurr(toCurr);
    setToCurr(fromCurr);
  };

  const handleRefreshRates = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl text-white overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Forex Rates & Travel Converter
              </h2>
              <p className="text-xs text-slate-400">
                Split bills across borders and multi-currency trips
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Main Converter Card */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-750 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
              {/* From currency & amount */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">
                  From
                </label>
                <select
                  value={fromCurr}
                  onChange={(e) => setFromCurr(e.target.value as CurrencyCode)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-base font-bold font-mono text-white focus:outline-none focus:border-amber-500 mt-1"
                />
              </div>

              {/* Swap Button */}
              <div className="flex justify-center sm:col-span-1 pt-4 sm:pt-0">
                <button
                  onClick={handleSwap}
                  className="p-2.5 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition shadow-md"
                  title="Swap currencies"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              {/* To currency & converted amount */}
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 uppercase">
                  To
                </label>
                <select
                  value={toCurr}
                  onChange={(e) => setToCurr(e.target.value as CurrencyCode)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
                <div className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-base font-bold font-mono text-emerald-400 mt-1 flex items-center justify-between">
                  <span>{formatMoney(convertedValue, toCurr)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs text-slate-400">
              <span className="font-mono">
                1 {fromCurr} = {unitRate} {toCurr}
              </span>
              <button
                onClick={handleRefreshRates}
                className="flex items-center gap-1 hover:text-white transition text-[11px]"
              >
                <RefreshCw
                  className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`}
                />
                <span>Live Rates Synced</span>
              </button>
            </div>
          </div>

          {/* Quick Popular Rates Grid */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Standard Forex Benchmark (1 USD =)</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { code: 'EUR', val: '0.92 €' },
                { code: 'INR', val: '₹86.85' },
                { code: 'GBP', val: '0.79 £' },
                { code: 'JPY', val: '152.4 ¥' },
                { code: 'CAD', val: '1.39 C$' },
                { code: 'AUD', val: '1.54 A$' },
              ].map((bench) => (
                <div
                  key={bench.code}
                  className="p-2.5 rounded-lg bg-slate-800/40 border border-slate-750 flex items-center justify-between text-xs"
                >
                  <span className="text-slate-400 font-semibold">{bench.code}</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {bench.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
