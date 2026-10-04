import React, { useState } from 'react';
import {
  Receipt,
  Utensils,
  Plane,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit2,
  Eye,
  Calendar,
  Sparkles,
  DollarSign,
  Plus,
  Camera,
} from 'lucide-react';
import { Expense, Group, UserProfile } from '../types';
import { formatMoney } from '../utils/forex';

interface ExpenseListProps {
  group: Group;
  currentUser: UserProfile;
  expenses: Expense[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (expenseId: string) => void;
  onScanReceiptClick: () => void;
  onAddExpenseClick: () => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  group,
  currentUser,
  expenses,
  onEditExpense,
  onDeleteExpense,
  onScanReceiptClick,
  onAddExpenseClick,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(
    expenses.length > 0 ? expenses[0].id : null
  );
  const [previewReceiptImage, setPreviewReceiptImage] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Expenses & Restaurant Bills</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
              {expenses.length}
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Itemized breakdown of who ordered what and uneven shares
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onScanReceiptClick}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-xs shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-1.5 active:scale-[0.99]"
          >
            <Camera className="w-4 h-4" />
            <span>Scan Receipt (AI)</span>
          </button>
          <button
            onClick={onAddExpenseClick}
            className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-750 text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Add Bill</span>
          </button>
        </div>
      </div>

      {/* Expenses Container */}
      {expenses.length === 0 ? (
        <div className="p-10 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
            <Receipt className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">No expenses recorded yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Scan a restaurant receipt with your camera or add a manual expense
              to start tracking uneven shares.
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={onScanReceiptClick}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md transition"
            >
              <Camera className="w-4 h-4" />
              <span>Scan Bill with Camera</span>
            </button>
            <button
              onClick={onAddExpenseClick}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700 transition"
            >
              Add Manually
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => {
            const isExpanded = expandedId === expense.id;
            const payer = group.members.find((m) => m.id === expense.payerId);
            const myShare = expense.memberShares[currentUser.id] || 0;
            const isPayer = expense.payerId === currentUser.id;

            return (
              <div
                key={expense.id}
                className="rounded-2xl bg-slate-900 border border-slate-750 overflow-hidden shadow-md transition hover:border-slate-700"
              >
                {/* Main Card Header */}
                <div
                  onClick={() => toggleExpand(expense.id)}
                  className="p-3.5 sm:p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 flex-shrink-0">
                      {expense.category === 'Restaurant' ? (
                        <Utensils className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Receipt className="w-5 h-5 text-teal-400" />
                      )}
                    </div>

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm truncate">
                          {expense.title}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                          {expense.splitMethod === 'by_items'
                            ? 'Itemized Dishes'
                            : expense.splitMethod === 'equal'
                            ? 'Equal Split'
                            : 'Custom Split'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-2 flex-wrap">
                        <span>{expense.date}</span>
                        <span>•</span>
                        <span>
                          Paid by{' '}
                          <strong className="text-slate-300">
                            {isPayer ? 'You' : payer?.name || 'Someone'}
                          </strong>
                        </span>
                        {expense.items.length > 0 && (
                          <>
                            <span>•</span>
                            <span>{expense.items.length} dishes</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3.5 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                    <div className="text-left sm:text-right">
                      <div className="font-extrabold text-sm sm:text-base font-mono text-white">
                        {formatMoney(expense.grandTotal, expense.currency)}
                      </div>
                      <div className="text-[11px] font-medium font-mono text-emerald-400">
                        {isPayer
                          ? `You lent ${formatMoney(
                              expense.grandTotal - myShare,
                              expense.currency
                            )}`
                          : `Your share: ${formatMoney(
                              myShare,
                              expense.currency
                            )}`}
                      </div>
                    </div>

                    <div className="p-1 rounded-lg text-slate-400 hover:text-white">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Detailed Breakdown */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 pt-0 border-t border-slate-800 bg-slate-900/50 space-y-4">
                    {/* Notes if any */}
                    {expense.notes && (
                      <p className="text-xs text-slate-400 bg-slate-800/40 p-2.5 rounded-xl border border-slate-750">
                        {expense.notes}
                      </p>
                    )}

                    {/* Line Items List if by_items */}
                    {expense.items && expense.items.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-slate-300">
                          Itemized Dishes & Share Assignments:
                        </div>
                        <div className="space-y-1.5">
                          {expense.items.map((item) => (
                            <div
                              key={item.id}
                              className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-750 flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-white truncate">
                                  {item.name}
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {item.assignedMemberIds.map((mId) => {
                                    const m = group.members.find((x) => x.id === mId);
                                    if (!m) return null;
                                    return (
                                      <span
                                        key={m.id}
                                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-700"
                                      >
                                        <img
                                          src={m.avatar}
                                          alt={m.name}
                                          className="w-3 h-3 rounded-full object-cover"
                                        />
                                        <span>{m.name.split(' ')[0]}</span>
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                              <span className="font-mono text-emerald-400 font-semibold flex-shrink-0">
                                {formatMoney(item.price, expense.currency)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tax, Service Fee & Tip Summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs p-3 rounded-xl bg-slate-800/30 border border-slate-750 font-mono">
                      <div>
                        <span className="text-slate-500 block text-[10px]">
                          Subtotal
                        </span>
                        <span className="text-slate-200">
                          {formatMoney(expense.subtotal, expense.currency)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">
                          Tax
                        </span>
                        <span className="text-slate-200">
                          {formatMoney(expense.taxAmount, expense.currency)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">
                          Service Fee
                        </span>
                        <span className="text-slate-200">
                          {formatMoney(expense.serviceCharge, expense.currency)}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">
                          Tip ({expense.tipPercentage || 0}%)
                        </span>
                        <span className="text-emerald-400">
                          {formatMoney(expense.tipAmount, expense.currency)}
                        </span>
                      </div>
                    </div>

                    {/* Breakdown per person */}
                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold text-slate-300">
                        Exact Split Per Person:
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {Object.entries(expense.memberShares).map(([mId, amt]) => {
                          const m = group.members.find((x) => x.id === mId);
                          if (!m) return null;
                          return (
                            <div
                              key={mId}
                              className="p-2 rounded-lg bg-slate-800/80 border border-slate-750 text-xs flex items-center justify-between"
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <img
                                  src={m.avatar}
                                  alt={m.name}
                                  className="w-4 h-4 rounded-full object-cover"
                                />
                                <span className="truncate text-slate-300">
                                  {m.name.split(' ')[0]}
                                </span>
                              </div>
                              <span className="font-mono text-emerald-400 font-semibold ml-2">
                                {formatMoney(amt, expense.currency)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actions: Edit, Delete, View Receipt */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      {expense.receiptImageUri ? (
                        <button
                          onClick={() =>
                            setPreviewReceiptImage(expense.receiptImageUri || null)
                          }
                          className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Scanned Receipt</span>
                        </button>
                      ) : (
                        <div />
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEditExpense(expense)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => onDeleteExpense(expense.id)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 text-xs flex items-center gap-1 transition"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Receipt Image Lightbox Modal */}
      {previewReceiptImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-lg w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-emerald-400" />
                <span>Captured Receipt Snapshot</span>
              </h3>
              <button
                onClick={() => setPreviewReceiptImage(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <ChevronUp className="w-5 h-5" />
              </button>
            </div>
            <img
              src={previewReceiptImage}
              alt="Receipt Preview"
              className="w-full max-h-[70vh] object-contain rounded-xl border border-slate-800"
            />
          </div>
        </div>
      )}
    </div>
  );
};
