import { DebtRelation, Expense, GroupMember, Settlement } from '../types';

export interface MemberBalance {
  memberId: string;
  netBalance: number; // positive = owed money, negative = owes money
  totalPaid: number;
  totalShare: number;
}

/**
 * Calculates each member's net balance within a group taking into account:
 * - Expenses paid by members
 * - Member shares in each expense
 * - Direct settlements already completed
 */
export function calculateGroupBalances(
  members: GroupMember[],
  expenses: Expense[],
  settlements: Settlement[]
): Record<string, MemberBalance> {
  const balances: Record<string, MemberBalance> = {};

  members.forEach((m) => {
    balances[m.id] = {
      memberId: m.id,
      netBalance: 0,
      totalPaid: 0,
      totalShare: 0,
    };
  });

  // Calculate from expenses
  expenses.forEach((expense) => {
    const payerId = expense.payerId;
    if (balances[payerId]) {
      balances[payerId].totalPaid += expense.grandTotal;
      balances[payerId].netBalance += expense.grandTotal;
    }

    Object.entries(expense.memberShares).forEach(([memberId, share]) => {
      if (balances[memberId]) {
        balances[memberId].totalShare += share;
        balances[memberId].netBalance -= share;
      }
    });
  });

  // Calculate from completed settlements
  settlements.forEach((settlement) => {
    // fromMemberId paid money to toMemberId
    if (balances[settlement.fromMemberId]) {
      balances[settlement.fromMemberId].netBalance += settlement.amount;
    }
    if (balances[settlement.toMemberId]) {
      balances[settlement.toMemberId].netBalance -= settlement.amount;
    }
  });

  // Round all balances to 2 decimal places to prevent floating point drift
  Object.keys(balances).forEach((id) => {
    balances[id].netBalance = Math.round(balances[id].netBalance * 100) / 100;
  });

  return balances;
}

/**
 * Greedy algorithm to simplify debts and produce the minimum number of transactions
 */
export function simplifyDebts(balances: Record<string, MemberBalance>): DebtRelation[] {
  const creditors: { id: string; amount: number }[] = [];
  const debtors: { id: string; amount: number }[] = [];

  Object.values(balances).forEach((b) => {
    const rounded = Math.round(b.netBalance * 100) / 100;
    if (rounded > 0.01) {
      creditors.push({ id: b.memberId, amount: rounded });
    } else if (rounded < -0.01) {
      debtors.push({ id: b.memberId, amount: Math.abs(rounded) });
    }
  });

  // Sort descending by amount
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transactions: DebtRelation[] = [];
  let cIdx = 0;
  let dIdx = 0;

  while (cIdx < creditors.length && dIdx < debtors.length) {
    const creditor = creditors[cIdx];
    const debtor = debtors[dIdx];

    const settledAmount = Math.min(creditor.amount, debtor.amount);
    const roundedSettled = Math.round(settledAmount * 100) / 100;

    if (roundedSettled > 0.01) {
      transactions.push({
        fromId: debtor.id,
        toId: creditor.id,
        amount: roundedSettled,
      });
    }

    creditor.amount = Math.round((creditor.amount - roundedSettled) * 100) / 100;
    debtor.amount = Math.round((debtor.amount - roundedSettled) * 100) / 100;

    if (creditor.amount <= 0.01) {
      cIdx++;
    }
    if (debtor.amount <= 0.01) {
      dIdx++;
    }
  }

  return transactions;
}
