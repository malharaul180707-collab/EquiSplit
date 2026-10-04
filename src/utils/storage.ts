import {
  ActivityItem,
  Expense,
  Group,
  GroupChatMessage,
  InAppNotification,
  Settlement,
  UserProfile,
} from '../types';

const STORAGE_KEYS = {
  USER_PROFILE: 'equisplit_user_profile_v1',
  GROUPS: 'equisplit_groups_v1',
  ACTIVE_GROUP_ID: 'equisplit_active_group_v1',
  EXPENSES: 'equisplit_expenses_v1',
  SETTLEMENTS: 'equisplit_settlements_v1',
  ACTIVITIES: 'equisplit_activities_v1',
  NOTIFICATIONS: 'equisplit_notifications_v1',
  CHAT_MESSAGES: 'equisplit_chat_messages_v1',
};

export const INITIAL_USER: UserProfile = {
  id: 'user_alex',
  name: 'Alex Morgan',
  email: 'raulmalhar18@gmail.com',
  phone: '+1 (555) 234-8901',
  isPhoneVerified: true,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  preferredCurrency: 'USD',
  theme: 'black',
  isAuthenticated: true,
  paymentDetails: {
    upiId: 'alexmorgan@okhdfcbank',
    paypalHandle: 'alexmorgan88',
    venmoTag: 'alex-morgan-split',
    cashAppTag: 'AlexMSplit',
    bankDetails: {
      bankName: 'JPMorgan Chase / HDFC Bank',
      accountNumber: '987654321048',
      ifscOrIban: 'HDFC0001234',
      accountHolder: 'Alex Morgan',
    },
  },
};

export const INITIAL_GROUPS: Group[] = [
  {
    id: 'group_dinner',
    name: 'Trattoria Pasta & Wine Night',
    category: 'restaurant',
    emoji: '🍝',
    currency: 'USD',
    createdAt: '2026-09-28T19:30:00.000Z',
    inviteCode: 'TRAT-7749',
    members: [
      {
        id: 'user_alex',
        name: 'Alex Morgan (You)',
        email: 'raulmalhar18@gmail.com',
        phone: '+1 (555) 234-8901',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        isCurrentUser: true,
        upiId: 'alexmorgan@okhdfcbank',
        paypalHandle: 'alexmorgan88',
        venmoTag: 'alex-morgan-split',
      },
      {
        id: 'member_maya',
        name: 'Maya Lin',
        email: 'maya.lin@example.com',
        phone: '+1 (555) 345-6789',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        upiId: 'mayalin@oksbi',
        paypalHandle: 'mayalin99',
        venmoTag: 'maya-lin-ny',
      },
      {
        id: 'member_david',
        name: 'David Kumar',
        email: 'david.kumar@example.com',
        phone: '+91 98765 43210',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        upiId: 'davidkumar@okaxis',
        paypalHandle: 'davidkumar',
        venmoTag: 'david-kumar-10',
      },
      {
        id: 'member_chloe',
        name: 'Chloe Vance',
        email: 'chloe.vance@example.com',
        phone: '+1 (555) 789-0123',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
        upiId: 'chloevance@paytm',
        paypalHandle: 'chloevance',
        venmoTag: 'chloe-vance',
      },
    ],
  },
  {
    id: 'group_goa',
    name: 'Goa Coastal Getaway 🌴',
    category: 'trip',
    emoji: '🏖️',
    currency: 'INR',
    createdAt: '2026-09-20T12:00:00.000Z',
    inviteCode: 'GOA-4821',
    members: [
      {
        id: 'user_alex',
        name: 'Alex Morgan (You)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        isCurrentUser: true,
        upiId: 'alexmorgan@okhdfcbank',
      },
      {
        id: 'member_david',
        name: 'David Kumar',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
        upiId: 'davidkumar@okaxis',
      },
      {
        id: 'member_rohan',
        name: 'Rohan Verma',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
        upiId: 'rohanverma@icici',
      },
      {
        id: 'member_priya',
        name: 'Priya Sharma',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
        upiId: 'priyasharma@okhdfcbank',
      },
    ],
  },
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp_bella_italia',
    groupId: 'group_dinner',
    title: 'Bella Italia Trattoria & Wine',
    date: '2026-09-28',
    currency: 'USD',
    originalAmount: 112.91,
    payerId: 'user_alex',
    splitMethod: 'by_items',
    category: 'Restaurant',
    notes: 'Scanned via receipt OCR. Uneven item split with drinks and tiramisu shared!',
    items: [
      {
        id: 'item_1',
        name: 'Woodfired Margherita Pizza',
        quantity: 1,
        price: 18.5,
        category: 'Food',
        assignedMemberIds: ['member_maya'],
      },
      {
        id: 'item_2',
        name: 'Truffle Tagliolini Pasta',
        quantity: 1,
        price: 24.0,
        category: 'Food',
        assignedMemberIds: ['user_alex'],
      },
      {
        id: 'item_3',
        name: 'Crispy Calamari Fritti',
        quantity: 1,
        price: 15.0,
        category: 'Appetizer',
        assignedMemberIds: ['member_david', 'member_chloe'],
      },
      {
        id: 'item_4',
        name: 'Aperol Spritz x2',
        quantity: 2,
        price: 26.0,
        category: 'Beverage',
        assignedMemberIds: ['user_alex', 'member_maya', 'member_david'],
      },
      {
        id: 'item_5',
        name: 'Traditional Tiramisu',
        quantity: 1,
        price: 9.5,
        category: 'Dessert',
        assignedMemberIds: ['member_chloe'],
      },
      {
        id: 'item_6',
        name: 'Sparkling San Pellegrino (750ml)',
        quantity: 1,
        price: 6.0,
        category: 'Beverage',
        assignedMemberIds: ['member_chloe', 'member_david'],
      },
    ],
    subtotal: 99.0,
    taxPercentage: 9,
    taxAmount: 8.91,
    serviceCharge: 5.0,
    tipPercentage: 0,
    tipAmount: 0,
    discount: 0,
    grandTotal: 112.91,
    memberShares: {
      user_alex: 37.28,
      member_maya: 31.02,
      member_david: 24.16,
      member_chloe: 20.45,
    },
    createdAt: '2026-09-28T21:10:00.000Z',
  },
  {
    id: 'exp_goa_villa',
    groupId: 'group_goa',
    title: 'Beachside Heritage Villa (3 Nights)',
    date: '2026-09-21',
    currency: 'INR',
    originalAmount: 18500,
    payerId: 'member_david',
    splitMethod: 'equal',
    category: 'Lodging',
    notes: 'Booked directly with host. 4-way equal split.',
    items: [
      {
        id: 'item_villa',
        name: 'Villa Stay & Breakfast',
        quantity: 1,
        price: 18500,
        category: 'Other',
        assignedMemberIds: ['user_alex', 'member_david', 'member_rohan', 'member_priya'],
      },
    ],
    subtotal: 18500,
    taxAmount: 0,
    serviceCharge: 0,
    tipAmount: 0,
    discount: 0,
    grandTotal: 18500,
    memberShares: {
      user_alex: 4625,
      member_david: 4625,
      member_rohan: 4625,
      member_priya: 4625,
    },
    createdAt: '2026-09-21T14:00:00.000Z',
  },
];

export const INITIAL_SETTLEMENTS: Settlement[] = [
  {
    id: 'settle_1',
    groupId: 'group_dinner',
    fromMemberId: 'member_maya',
    toMemberId: 'user_alex',
    amount: 15.0,
    currency: 'USD',
    paymentMethod: 'venmo',
    transactionRef: 'VNMO-982187',
    date: '2026-09-29',
    notes: 'Partial payment for dinner pasta & wine',
    status: 'settled',
  },
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act_1',
    groupId: 'group_dinner',
    actorName: 'Alex Morgan',
    action: 'create_expense',
    title: 'Scanned receipt: Bella Italia Trattoria',
    description: 'Uneven split across 4 diners with OCR itemized dishes ($112.91)',
    timestamp: '2026-09-28T21:10:00.000Z',
    amount: 112.91,
    currency: 'USD',
  },
  {
    id: 'act_2',
    groupId: 'group_dinner',
    actorName: 'Maya Lin',
    action: 'settle_up',
    title: 'Maya Lin paid Alex Morgan $15.00',
    description: 'Paid via Venmo (Ref: VNMO-982187)',
    timestamp: '2026-09-29T10:15:00.000Z',
    amount: 15.0,
    currency: 'USD',
  },
];

export const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif_1',
    title: 'Payment Received from Maya',
    message: 'Maya Lin sent you $15.00 via Venmo for Trattoria dinner.',
    timestamp: '2026-09-29T10:15:00.000Z',
    read: false,
    type: 'settled',
  },
  {
    id: 'notif_2',
    title: 'Added to Goa Coastal Getaway',
    message: 'David Kumar added you to Beachside Heritage Villa (Your share: ₹4,625).',
    timestamp: '2026-09-21T14:05:00.000Z',
    read: true,
    type: 'bill_added',
  },
];

export const INITIAL_CHAT_MESSAGES: GroupChatMessage[] = [
  {
    id: 'msg_1',
    groupId: 'group_dinner',
    senderId: 'member_maya',
    senderName: 'Maya Lin',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    text: 'Thanks for scanning the receipt Alex! The itemized dish split looks so clean.',
    timestamp: '2026-09-28T21:20:00.000Z',
    referencedExpenseTitle: 'Bella Italia Trattoria & Wine',
  },
  {
    id: 'msg_2',
    groupId: 'group_dinner',
    senderId: 'user_alex',
    senderName: 'Alex Morgan',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    text: 'Anytime! Don\'t forget to use the UPI or Venmo 1-tap links when settling up 🙌',
    timestamp: '2026-09-28T21:25:00.000Z',
  },
  {
    id: 'msg_3',
    groupId: 'group_dinner',
    senderId: 'member_david',
    senderName: 'David Kumar',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    text: 'Sent my share via UPI QR! So convenient.',
    timestamp: '2026-09-29T09:30:00.000Z',
  },
];

// Offline LocalStorage helpers
export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to load key ${key} from localStorage:`, err);
    return fallback;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Failed to save key ${key} to localStorage:`, err);
  }
}

export { STORAGE_KEYS };
