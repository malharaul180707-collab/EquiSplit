export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'INR'
  | 'JPY'
  | 'CAD'
  | 'AUD'
  | 'SGD'
  | 'AED'
  | 'CHF'
  | 'CNY'
  | 'MXN';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso', flag: '🇲🇽' },
];

export interface PaymentDetails {
  upiId?: string;
  paypalHandle?: string;
  venmoTag?: string;
  cashAppTag?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifscOrIban: string;
    accountHolder: string;
  };
}

export type ColorTheme =
  | 'black'
  | 'white'
  | 'orange'
  | 'emerald'
  | 'indigo'
  | 'crimson';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  isPhoneVerified: boolean;
  avatar: string;
  paymentDetails: PaymentDetails;
  preferredCurrency: CurrencyCode;
  theme: ColorTheme;
  isAuthenticated: boolean;
}

export interface GroupChatMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  referencedExpenseTitle?: string;
}

export interface GroupMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatar: string;
  isCurrentUser?: boolean;
  upiId?: string;
  paypalHandle?: string;
  venmoTag?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    ifscOrIban: string;
    accountHolder: string;
  };
}

export type GroupCategory = 'restaurant' | 'trip' | 'event' | 'home' | 'other';

export interface Group {
  id: string;
  name: string;
  category: GroupCategory;
  emoji: string;
  currency: CurrencyCode;
  members: GroupMember[];
  createdAt: string;
  inviteCode: string;
}

export interface ExpenseItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: string;
  assignedMemberIds: string[]; // members sharing this item
}

export type SplitMethod =
  | 'by_items'
  | 'equal'
  | 'exact_amounts'
  | 'percentages'
  | 'shares';

export interface Expense {
  id: string;
  groupId: string;
  title: string;
  date: string;
  currency: CurrencyCode;
  originalAmount: number;
  payerId: string;
  splitMethod: SplitMethod;
  items: ExpenseItem[];
  subtotal: number;
  taxAmount: number;
  taxPercentage?: number;
  serviceCharge: number;
  tipAmount: number;
  tipPercentage?: number;
  discount: number;
  grandTotal: number;
  memberShares: Record<string, number>; // memberId -> owed amount
  receiptImageUri?: string;
  category: string;
  notes?: string;
  createdAt: string;
}

export interface Settlement {
  id: string;
  groupId: string;
  fromMemberId: string;
  toMemberId: string;
  amount: number;
  currency: CurrencyCode;
  paymentMethod: 'upi' | 'paypal' | 'venmo' | 'cashapp' | 'netbanking' | 'cash';
  transactionRef?: string;
  date: string;
  notes?: string;
  status: 'settled';
}

export interface ActivityItem {
  id: string;
  groupId: string;
  actorName: string;
  actorAvatar?: string;
  action: 'create_expense' | 'update_expense' | 'delete_expense' | 'settle_up' | 'reminder_sent' | 'member_added';
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
  currency?: CurrencyCode;
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'debt_reminder' | 'bill_added' | 'settled';
}

export interface DebtRelation {
  fromId: string;
  toId: string;
  amount: number;
}
