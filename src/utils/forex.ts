import { CurrencyCode, SUPPORTED_CURRENCIES } from '../types';

export const DEFAULT_FOREX_RATES: Record<CurrencyCode, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 86.85,
  CAD: 1.39,
  AUD: 1.54,
  JPY: 152.4,
  SGD: 1.34,
  AED: 3.67,
  CHF: 0.88,
  CNY: 7.24,
  MXN: 20.35,
};

let activeRates: Record<string, number> = { ...DEFAULT_FOREX_RATES };

export async function fetchLiveForexRates(): Promise<Record<string, number>> {
  try {
    const res = await fetch('/api/forex');
    if (res.ok) {
      const data = await res.json();
      if (data.rates) {
        activeRates = { ...DEFAULT_FOREX_RATES, ...data.rates };
        return activeRates;
      }
    }
  } catch (err) {
    console.warn('Using offline forex rates:', err);
  }
  return activeRates;
}

export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  rates: Record<string, number> = activeRates
): number {
  if (from === to) return amount;
  const fromRate = rates[from] || DEFAULT_FOREX_RATES[from] || 1;
  const toRate = rates[to] || DEFAULT_FOREX_RATES[to] || 1;
  // Convert from origin to USD, then from USD to target
  const inUSD = amount / fromRate;
  return Number((inUSD * toRate).toFixed(2));
}

export function getCurrencySymbol(code: CurrencyCode): string {
  const c = SUPPORTED_CURRENCIES.find((item) => item.code === code);
  return c ? c.symbol : '$';
}

export function formatMoney(amount: number, code: CurrencyCode = 'USD'): string {
  const symbol = getCurrencySymbol(code);
  const formattedNumber = Math.abs(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (amount < 0) {
    return `-${symbol}${formattedNumber}`;
  }
  return `${symbol}${formattedNumber}`;
}
