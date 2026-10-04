import React, { useState, useEffect } from 'react';
import {
  X,
  Receipt,
  Plus,
  Trash2,
  Check,
  Percent,
  Sliders,
  Users,
  Coins,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import {
  CurrencyCode,
  Expense,
  ExpenseItem,
  Group,
  GroupMember,
  SplitMethod,
  SUPPORTED_CURRENCIES,
  UserProfile,
} from '../types';
import {
  convertCurrency,
  formatMoney,
  getCurrencySymbol,
} from '../utils/forex';

interface ExpenseModalProps {
  group: Group;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  initialExpense?: Expense | null;
}

const CATEGORIES = [
  'Restaurant',
  'Drinks & Bar',
  'Groceries',
  'Trip & Vacation',
  'Hotel & Lodging',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Utilities',
  'Other',
];

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  group,
  currentUser,
  isOpen,
  onClose,
  onSaveExpense,
  initialExpense,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Restaurant');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [currency, setCurrency] = useState<CurrencyCode>(group.currency);
  const [payerId, setPayerId] = useState(currentUser.id);
  const [splitMethod, setSplitMethod] = useState<SplitMethod>('equal');

  // Amounts
  const [subtotal, setSubtotal] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [serviceCharge, setServiceCharge] = useState<number>(0);
  const [tipPercentage, setTipPercentage] = useState<number | null>(15);
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Items for by_items split
  const [items, setItems] = useState<ExpenseItem[]>([
    {
      id: 'item_1',
      name: 'Main Dish / Expense',
      quantity: 1,
      price: 0,
      category: 'Food',
      assignedMemberIds: group.members.map((m) => m.id),
    },
  ]);

  // Exact amounts state: memberId -> custom amount
  const [exactAmounts, setExactAmounts] = useState<Record<string, number>>({});
  // Percentages state: memberId -> custom percentage
  const [percentages, setPercentages] = useState<Record<string, number>>({});
  // Shares state: memberId -> number of shares
  const [shares, setShares] = useState<Record<string, number>>({});
  // Selected members for equal split
  const [selectedMembers, setSelectedMembers] = useState<string[]>(
    group.members.map((m) => m.id)
  );

  useEffect(() => {
    if (initialExpense) {
      setTitle(initialExpense.title);
      setCategory(initialExpense.category);
      setDate(initialExpense.date);
      setCurrency(initialExpense.currency);
      setPayerId(initialExpense.payerId);
      setSplitMethod(initialExpense.splitMethod);
      setSubtotal(initialExpense.subtotal);
      setTaxAmount(initialExpense.taxAmount);
      setServiceCharge(initialExpense.serviceCharge);
      setTipAmount(initialExpense.tipAmount);
      setTipPercentage(initialExpense.tipPercentage ?? 0);
      setDiscount(initialExpense.discount);
      setNotes(initialExpense.notes || '');
      setItems(initialExpense.items || []);
      setExactAmounts(initialExpense.memberShares || {});
    } else {
      // Reset defaults
      setTitle('');
      setCategory('Restaurant');
      setDate(new Date().toISOString().split('T')[0]);
      setCurrency(group.currency);
      setPayerId(currentUser.id);
      setSplitMethod('equal');
      setSubtotal(0);
      setTaxAmount(0);
      setServiceCharge(0);
      setTipAmount(0);
      setTipPercentage(15);
      setDiscount(0);
      setNotes('');
      setItems([
        {
          id: 'item_1',
          name: 'Main Dish / Expense',
          quantity: 1,
          price: 0,
          category: 'Food',
          assignedMemberIds: group.members.map((m) => m.id),
        },
      ]);
      const initialPerc: Record<string, number> = {};
      const initialShares: Record<string, number> = {};
      const equalPct = Number((100 / group.members.length).toFixed(1));
      group.members.forEach((m) => {
        initialPerc[m.id] = equalPct;
        initialShares[m.id] = 1;
      });
      setPercentages(initialPerc);
      setShares(initialShares);
      setSelectedMembers(group.members.map((m) => m.id));
    }
  }, [initialExpense, isOpen, group]);

  if (!isOpen) return null;

  // Calculate tip when subtotal or percentage changes
  const handleSubtotalChange = (val: number) => {
    setSubtotal(val);
    if (tipPercentage !== null) {
      setTipAmount(Number((val * (tipPercentage / 100)).toFixed(2)));
    }
  };

  const handleTipPctChange = (pct: number | null) => {
    setTipPercentage(pct);
    if (pct !== null) {
      setTipAmount(Number((subtotal * (pct / 100)).toFixed(2)));
    }
  };

  const grandTotal = Math.max(
    0,
    Number((subtotal + taxAmount + serviceCharge + tipAmount - discount).toFixed(2))
  );

  // Calculate final member shares based on selected split method
  const computeFinalShares = (): Record<string, number> => {
    const sharesMap: Record<string, number> = {};
    group.members.forEach((m) => (sharesMap[m.id] = 0));

    if (splitMethod === 'equal') {
      const activeMembers = selectedMembers.length > 0 ? selectedMembers : group.members.map((m) => m.id);
      const perPerson = Number((grandTotal / activeMembers.length).toFixed(2));
      let distributed = 0;
      activeMembers.forEach((id, idx) => {
        if (idx === activeMembers.length - 1) {
          // Adjust last person for rounding pennies
          sharesMap[id] = Number((grandTotal - distributed).toFixed(2));
        } else {
          sharesMap[id] = perPerson;
          distributed += perPerson;
        }
      });
    } else if (splitMethod === 'exact_amounts') {
      group.members.forEach((m) => {
        sharesMap[m.id] = exactAmounts[m.id] || 0;
      });
    } else if (splitMethod === 'percentages') {
      group.members.forEach((m) => {
        const pct = percentages[m.id] || 0;
        sharesMap[m.id] = Number(((grandTotal * pct) / 100).toFixed(2));
      });
    } else if (splitMethod === 'shares') {
      const totalShares = Object.values(shares).reduce((a, b) => a + (b || 0), 0) || 1;
      group.members.forEach((m) => {
        const memberShareCount = shares[m.id] || 0;
        sharesMap[m.id] = Number(((grandTotal * memberShareCount) / totalShares).toFixed(2));
      });
    } else if (splitMethod === 'by_items') {
      const itemSubtotal = items.reduce((s, it) => s + (it.price || 0), 0);
      const extraTotal = taxAmount + serviceCharge + tipAmount - discount;

      const memberItemTotals: Record<string, number> = {};
      group.members.forEach((m) => (memberItemTotals[m.id] = 0));

      items.forEach((it) => {
        if (it.assignedMemberIds.length > 0) {
          const share = it.price / it.assignedMemberIds.length;
          it.assignedMemberIds.forEach((mId) => {
            memberItemTotals[mId] = (memberItemTotals[mId] || 0) + share;
          });
        }
      });

      group.members.forEach((m) => {
        const memberRatio = itemSubtotal > 0 ? memberItemTotals[m.id] / itemSubtotal : 1 / group.members.length;
        const extraShare = extraTotal * memberRatio;
        sharesMap[m.id] = Number((memberItemTotals[m.id] + extraShare).toFixed(2));
      });
    }

    return sharesMap;
  };

  const calculatedShares = computeFinalShares();
  const sumOfShares = Object.values(calculatedShares).reduce((a, b) => a + b, 0);
  const sharesDiscrepancy = Math.abs(sumOfShares - grandTotal);
  const isExactSumMatching = splitMethod !== 'exact_amounts' || sharesDiscrepancy < 0.05;

  const handleSave = () => {
    // If currency differs from group currency, convert to group currency for tracking
    const finalAmountInGroupCurrency = convertCurrency(grandTotal, currency, group.currency);

    // Convert member shares if currency is different
    const normalizedShares: Record<string, number> = {};
    Object.entries(calculatedShares).forEach(([mId, val]) => {
      normalizedShares[mId] = convertCurrency(val, currency, group.currency);
    });

    onSaveExpense({
      groupId: group.id,
      title: title.trim() || `${category} Bill`,
      date,
      currency: group.currency,
      originalAmount: finalAmountInGroupCurrency,
      payerId,
      splitMethod,
      items: splitMethod === 'by_items' ? items : [],
      subtotal: convertCurrency(subtotal, currency, group.currency),
      taxAmount: convertCurrency(taxAmount, currency, group.currency),
      serviceCharge: convertCurrency(serviceCharge, currency, group.currency),
      tipAmount: convertCurrency(tipAmount, currency, group.currency),
      tipPercentage: tipPercentage || 0,
      discount: convertCurrency(discount, currency, group.currency),
      grandTotal: finalAmountInGroupCurrency,
      memberShares: normalizedShares,
      category,
      notes: currency !== group.currency
        ? `${notes ? notes + ' • ' : ''}Paid in ${currency} ${grandTotal} (Converted at live forex rate)`
        : notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-3xl rounded-2xl shadow-2xl text-white overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {initialExpense ? 'Edit Bill / Expense' : 'Add Bill / Group Expense'}
              </h2>
              <p className="text-xs text-slate-400">
                Custom uneven splits, tips, taxes, and multi-currency conversion
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Title & Category & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Expense Description
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pasta Dinner, Airbnb, Groceries, Flight"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Currency, Date, and Payer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-800/40 p-4 rounded-xl border border-slate-750">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase text-slate-400">
                Currency Paid
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} ({c.symbol})
                  </option>
                ))}
              </select>
              {currency !== group.currency && (
                <div className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
                  <Coins className="w-3 h-3" />
                  <span>
                    Auto-converts to group currency ({group.currency})
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase text-slate-400">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase text-slate-400">
                Paid by
              </label>
              <select
                value={payerId}
                onChange={(e) => setPayerId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {group.members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount & Tip / Tax Calculator */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Subtotal ({getCurrencySymbol(currency)})
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={subtotal || ''}
                  onChange={(e) => handleSubtotalChange(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-base font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Tax Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={taxAmount || ''}
                  onChange={(e) => setTaxAmount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Service Fee / Charge
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={serviceCharge || ''}
                  onChange={(e) => setServiceCharge(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span>Tip ({formatMoney(tipAmount, currency)})</span>
                </div>
                <div className="flex gap-1">
                  {[0, 10, 15, 20].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleTipPctChange(pct)}
                      className={`flex-1 py-1.5 rounded text-xs font-medium transition ${
                        tipPercentage === pct
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-slate-900 hover:bg-slate-750 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-750">
              <span className="text-xs text-slate-400">Grand Total to Split:</span>
              <span className="text-xl font-bold text-emerald-400 font-mono">
                {formatMoney(grandTotal, currency)}
              </span>
            </div>
          </div>

          {/* Uneven Split Method Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>Split Method</span>
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'equal', label: 'Split Equally' },
                { id: 'by_items', label: 'By Claimed Items' },
                { id: 'exact_amounts', label: 'Exact Amounts' },
                { id: 'percentages', label: 'By % (Percentage)' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSplitMethod(m.id as SplitMethod)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition text-center border ${
                    splitMethod === m.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md font-bold'
                      : 'bg-slate-800/80 hover:bg-slate-750 text-slate-400 border-slate-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Split Method Details */}
            {splitMethod === 'equal' && (
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-750 space-y-2">
                <p className="text-xs text-slate-400">
                  Select which members share this bill equally:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {group.members.map((m) => {
                    const isSelected = selectedMembers.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            if (selectedMembers.length > 1) {
                              setSelectedMembers(selectedMembers.filter((id) => id !== m.id));
                            }
                          } else {
                            setSelectedMembers([...selectedMembers, m.id]);
                          }
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                            : 'bg-slate-900 border-slate-700 text-slate-400'
                        }`}
                      >
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span>{m.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {splitMethod === 'exact_amounts' && (
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-750 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Enter specific amount for each person:
                  </span>
                  <span
                    className={`font-mono font-medium ${
                      isExactSumMatching ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    Sum: {formatMoney(sumOfShares, currency)} / {formatMoney(grandTotal, currency)}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {group.members.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between gap-2 p-2 bg-slate-900 rounded-lg border border-slate-750"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-xs truncate">{m.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-slate-400">
                          {getCurrencySymbol(currency)}
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          value={exactAmounts[m.id] || ''}
                          onChange={(e) =>
                            setExactAmounts({
                              ...exactAmounts,
                              [m.id]: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="0.00"
                          className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-right text-emerald-400 focus:outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {splitMethod === 'percentages' && (
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-750 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Enter percentage for each person:</span>
                  <span className="font-mono text-emerald-400">
                    Total: {Object.values(percentages).reduce((a, b) => a + (b || 0), 0)}%
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {group.members.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between gap-2 p-2 bg-slate-900 rounded-lg border border-slate-750"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img
                          src={m.avatar}
                          alt={m.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="text-xs truncate">{m.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step="0.5"
                          value={percentages[m.id] ?? ''}
                          onChange={(e) =>
                            setPercentages({
                              ...percentages,
                              [m.id]: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-16 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-right text-emerald-400 focus:outline-none focus:border-emerald-500"
                        />
                        <span className="text-xs text-slate-400">%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {splitMethod === 'by_items' && (
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-750 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Itemize dishes or expenditures:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const newItem: ExpenseItem = {
                        id: `item_${Date.now()}`,
                        name: `Item ${items.length + 1}`,
                        quantity: 1,
                        price: 0,
                        category: 'Food',
                        assignedMemberIds: group.members.map((m) => m.id),
                      };
                      setItems([...items, newItem]);
                    }}
                    className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {items.map((it) => (
                    <div
                      key={it.id}
                      className="p-2.5 bg-slate-900 rounded-lg border border-slate-750 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={it.name}
                          onChange={(e) =>
                            setItems(
                              items.map((x) =>
                                x.id === it.id ? { ...x, name: e.target.value } : x
                              )
                            )
                          }
                          className="bg-transparent border-b border-slate-700 focus:border-emerald-500 text-xs font-medium text-white px-1 py-0.5 flex-1 focus:outline-none"
                        />
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-slate-400">
                            {getCurrencySymbol(currency)}
                          </span>
                          <input
                            type="number"
                            step="0.01"
                            value={it.price || ''}
                            onChange={(e) => {
                              const newPrice = parseFloat(e.target.value) || 0;
                              const updated = items.map((x) =>
                                x.id === it.id ? { ...x, price: newPrice } : x
                              );
                              setItems(updated);
                              const newSub = updated.reduce((s, x) => s + (x.price || 0), 0);
                              setSubtotal(newSub);
                            }}
                            placeholder="0.00"
                            className="w-18 bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-xs font-mono text-right text-emerald-400 focus:outline-none focus:border-emerald-500"
                          />
                          {items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = items.filter((x) => x.id !== it.id);
                                setItems(updated);
                                setSubtotal(updated.reduce((s, x) => s + (x.price || 0), 0));
                              }}
                              className="p-1 text-slate-500 hover:text-rose-400 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Who shared this item */}
                      <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-800 text-[11px]">
                        <span className="text-slate-400 mr-1">Shared by:</span>
                        {group.members.map((m) => {
                          const assigned = it.assignedMemberIds.includes(m.id);
                          return (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => {
                                const updatedMembers = assigned
                                  ? it.assignedMemberIds.filter((id) => id !== m.id)
                                  : [...it.assignedMemberIds, m.id];
                                setItems(
                                  items.map((x) =>
                                    x.id === it.id
                                      ? {
                                          ...x,
                                          assignedMemberIds:
                                            updatedMembers.length > 0
                                              ? updatedMembers
                                              : [m.id],
                                        }
                                      : x
                                  )
                                );
                              }}
                              className={`px-2 py-0.5 rounded-full transition ${
                                assigned
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium'
                                  : 'bg-slate-800 text-slate-500 border border-slate-700/60'
                              }`}
                            >
                              {m.name.split(' ')[0]}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Breakdown Preview */}
          <div className="p-3.5 rounded-xl bg-slate-800/30 border border-slate-750">
            <h4 className="text-xs font-semibold uppercase text-slate-400 mb-2">
              Calculated Share Per Person:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {group.members.map((m) => (
                <div
                  key={m.id}
                  className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs"
                >
                  <div className="text-slate-400 truncate">{m.name.split(' ')[0]}</div>
                  <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                    {formatMoney(calculatedShares[m.id] || 0, currency)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={grandTotal <= 0}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition active:scale-[0.99] flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{initialExpense ? 'Update Expense' : 'Save & Split Bill'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
