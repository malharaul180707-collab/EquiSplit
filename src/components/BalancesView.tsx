import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  BellRing,
  Sparkles,
  CreditCard,
  UserCheck,
  TrendingUp,
  TrendingDown,
  Scale,
} from 'lucide-react';
import {
  DebtRelation,
  Expense,
  Group,
  GroupMember,
  Settlement,
  UserProfile,
} from '../types';
import { calculateGroupBalances, simplifyDebts } from '../utils/debtSimplifier';
import { formatMoney } from '../utils/forex';

interface BalancesViewProps {
  group: Group;
  currentUser: UserProfile;
  expenses: Expense[];
  settlements: Settlement[];
  onOpenSettleModal: (payerId: string, receiverId: string, amount: number) => void;
  onOpenReminderModal: (debtor: GroupMember, amount: number) => void;
}

export const BalancesView: React.FC<BalancesViewProps> = ({
  group,
  currentUser,
  expenses,
  settlements,
  onOpenSettleModal,
  onOpenReminderModal,
}) => {
  const memberBalances = calculateGroupBalances(group.members, expenses, settlements);
  const simplifiedTransactions = simplifyDebts(memberBalances);

  const myBalance = memberBalances[currentUser.id]?.netBalance || 0;
  const isSettledUp = simplifiedTransactions.length === 0;

  return (
    <div className="space-y-6">
      {/* Top Net Summary Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-slate-750 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-emerald-400" />
              <span>Your Personal Balance in {group.name}</span>
            </span>
            <div className="flex items-baseline gap-3">
              <span
                className={`text-3xl sm:text-4xl font-extrabold font-mono tracking-tight ${
                  myBalance > 0.01
                    ? 'text-emerald-400'
                    : myBalance < -0.01
                    ? 'text-rose-400'
                    : 'text-slate-300'
                }`}
              >
                {formatMoney(myBalance, group.currency)}
              </span>
              <span className="text-xs font-medium text-slate-400">
                {myBalance > 0.01
                  ? 'You are owed'
                  : myBalance < -0.01
                  ? 'You owe in total'
                  : 'All settled up!'}
              </span>
            </div>
          </div>

          {/* Quick status badge */}
          <div className="flex items-center gap-2">
            {isSettledUp ? (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero Group Debts</span>
              </div>
            ) : (
              <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <span>
                  {simplifiedTransactions.length} simplified transfer
                  {simplifiedTransactions.length > 1 ? 's' : ''} to settle group
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Suggested Simplified Transfers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Optimal Settlement Plan (Minimum Transfers)</span>
          </h3>
          <span className="text-xs text-slate-400">
            Powered by smart debt simplification
          </span>
        </div>

        {isSettledUp ? (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Everyone is Settled Up!</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No outstanding balances in this group. All past restaurant checks and
              trips are fully squared away.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {simplifiedTransactions.map((tx, idx) => {
              const fromMember = group.members.find((m) => m.id === tx.fromId);
              const toMember = group.members.find((m) => m.id === tx.toId);
              if (!fromMember || !toMember) return null;

              const isUserPayer = tx.fromId === currentUser.id;
              const isUserReceiver = tx.toId === currentUser.id;

              return (
                <div
                  key={idx}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isUserPayer
                      ? 'bg-rose-950/20 border-rose-500/30'
                      : isUserReceiver
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : 'bg-slate-900/80 border-slate-750'
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                    {/* From Avatar */}
                    <div className="flex items-center gap-2">
                      <img
                        src={fromMember.avatar}
                        alt={fromMember.name}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-slate-700 flex-shrink-0"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-white block">
                          {fromMember.id === currentUser.id
                            ? 'You'
                            : fromMember.name}
                        </span>
                        <span className="text-[10px] text-slate-400">owes</span>
                      </div>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-500 flex-shrink-0" />

                    {/* To Avatar */}
                    <div className="flex items-center gap-2">
                      <img
                        src={toMember.avatar}
                        alt={toMember.name}
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-emerald-500/40 flex-shrink-0"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-white block">
                          {toMember.id === currentUser.id ? 'You' : toMember.name}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-medium">
                          receives
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amount and Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                    <span className="text-sm sm:text-lg font-bold font-mono text-emerald-400">
                      {formatMoney(tx.amount, group.currency)}
                    </span>

                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {isUserReceiver && (
                        <button
                          onClick={() => onOpenReminderModal(fromMember, tx.amount)}
                          className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1 transition min-h-[36px]"
                          title="Send polite reminder"
                        >
                          <BellRing className="w-3.5 h-3.5" />
                          <span>Remind</span>
                        </button>
                      )}

                      <button
                        onClick={() =>
                          onOpenSettleModal(tx.fromId, tx.toId, tx.amount)
                        }
                        className="px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition min-h-[36px]"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Settle Up</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Member Standings Matrix */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-slate-400" />
          <span>Individual Member Standings</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {group.members.map((member) => {
            const b = memberBalances[member.id] || {
              netBalance: 0,
              totalPaid: 0,
              totalShare: 0,
            };
            const isMe = member.id === currentUser.id;

            return (
              <div
                key={member.id}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-750 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="truncate">
                      <div className="font-bold text-white truncate">
                        {member.name} {isMe && '(You)'}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {member.upiId || 'No UPI setup'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Paid:</span>
                    <span className="font-mono text-slate-200">
                      {formatMoney(b.totalPaid, group.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Share:</span>
                    <span className="font-mono text-slate-200">
                      {formatMoney(b.totalShare, group.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 font-semibold">
                    <span>Net Balance:</span>
                    <span
                      className={`font-mono font-bold ${
                        b.netBalance > 0.01
                          ? 'text-emerald-400'
                          : b.netBalance < -0.01
                          ? 'text-rose-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {b.netBalance > 0.01 ? '+' : ''}
                      {formatMoney(b.netBalance, group.currency)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
