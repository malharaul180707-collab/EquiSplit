/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Camera,
  Plus,
  CreditCard,
  QrCode,
  Users,
  Receipt,
  Scale,
  History,
  Sparkles,
  Plane,
  Utensils,
  Share2,
  CheckCircle2,
  TrendingUp,
  Coins,
  ShieldCheck,
  MessageSquare,
  Palette,
  LogIn,
  LogOut,
  X,
} from 'lucide-react';
import {
  ActivityItem,
  ColorTheme,
  CurrencyCode,
  Expense,
  Group,
  GroupChatMessage,
  GroupMember,
  InAppNotification,
  Settlement,
  UserProfile,
} from './types';
import {
  INITIAL_ACTIVITIES,
  INITIAL_CHAT_MESSAGES,
  INITIAL_EXPENSES,
  INITIAL_GROUPS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTLEMENTS,
  INITIAL_USER,
  STORAGE_KEYS,
  loadFromStorage,
  saveToStorage,
} from './utils/storage';
import { calculateGroupBalances } from './utils/debtSimplifier';
import { convertCurrency, formatMoney } from './utils/forex';
import { THEME_CONFIGS } from './utils/theme';

import { Navbar } from './components/Navbar';
import { CameraReceiptScanner } from './components/CameraReceiptScanner';
import { ExpenseModal } from './components/ExpenseModal';
import { SettleUpModal } from './components/SettleUpModal';
import { GroupInviteModal } from './components/GroupInviteModal';
import { ReminderModal } from './components/ReminderModal';
import { UserProfileModal } from './components/UserProfileModal';
import { ForexCalculatorModal } from './components/ForexCalculatorModal';
import { SecurityModal } from './components/SecurityModal';
import { CreateGroupModal } from './components/CreateGroupModal';
import { ExpenseList } from './components/ExpenseList';
import { BalancesView } from './components/BalancesView';
import { ActivityFeed } from './components/ActivityFeed';
import { GroupChat } from './components/GroupChat';
import { AuthModal } from './components/AuthModal';

export default function App() {
  // Primary State loaded from LocalStorage for 100% offline functionality
  const [user, setUser] = useState<UserProfile>(() =>
    loadFromStorage(STORAGE_KEYS.USER_PROFILE, INITIAL_USER)
  );
  const [groups, setGroups] = useState<Group[]>(() =>
    loadFromStorage(STORAGE_KEYS.GROUPS, INITIAL_GROUPS)
  );
  const [activeGroupId, setActiveGroupId] = useState<string>(() =>
    loadFromStorage(
      STORAGE_KEYS.ACTIVE_GROUP_ID,
      groups.length > 0 ? groups[0].id : INITIAL_GROUPS[0].id
    )
  );
  const [expenses, setExpenses] = useState<Expense[]>(() =>
    loadFromStorage(STORAGE_KEYS.EXPENSES, INITIAL_EXPENSES)
  );
  const [settlements, setSettlements] = useState<Settlement[]>(() =>
    loadFromStorage(STORAGE_KEYS.SETTLEMENTS, INITIAL_SETTLEMENTS)
  );
  const [activities, setActivities] = useState<ActivityItem[]>(() =>
    loadFromStorage(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES)
  );
  const [notifications, setNotifications] = useState<InAppNotification[]>(() =>
    loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
  );
  const [chatMessages, setChatMessages] = useState<GroupChatMessage[]>(() =>
    loadFromStorage(STORAGE_KEYS.CHAT_MESSAGES, INITIAL_CHAT_MESSAGES)
  );

  // Active UI Navigation Tab
  const [activeTab, setActiveTab] = useState<
    'expenses' | 'balances' | 'chat' | 'activity' | 'members'
  >('expenses');

  // Modals state
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [settleConfig, setSettleConfig] = useState<{
    payerId?: string;
    receiverId?: string;
    amount?: number;
  }>({});
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isForexOpen, setIsForexOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Floating Chat Drawer Toggle on Desktop
  const [isChatFloatingOpen, setIsChatFloatingOpen] = useState(false);

  // Reminder Modal
  const [reminderConfig, setReminderConfig] = useState<{
    isOpen: boolean;
    debtor: GroupMember | null;
    amount: number;
  }>({
    isOpen: false,
    debtor: null,
    amount: 0,
  });

  // Current active group
  const activeGroup =
    groups.find((g) => g.id === activeGroupId) || groups[0] || INITIAL_GROUPS[0];

  // Active currency
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>(
    activeGroup.currency
  );

  // Sync active group's currency when active group changes
  useEffect(() => {
    if (activeGroup) {
      setSelectedCurrency(activeGroup.currency);
    }
  }, [activeGroupId]);

  // Sync to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.USER_PROFILE, user);
  }, [user]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.GROUPS, groups);
  }, [groups]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ACTIVE_GROUP_ID, activeGroupId);
  }, [activeGroupId]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
  }, [expenses]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SETTLEMENTS, settlements);
  }, [settlements]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ACTIVITIES, activities);
  }, [activities]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }, [notifications]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CHAT_MESSAGES, chatMessages);
  }, [chatMessages]);

  // Filter expenses and settlements for active group
  const groupExpenses = expenses.filter((e) => e.groupId === activeGroup.id);
  const groupSettlements = settlements.filter((s) => s.groupId === activeGroup.id);
  const groupChatMessages = chatMessages.filter((m) => m.groupId === activeGroup.id);

  // Computed metrics for active group
  const groupBalances = calculateGroupBalances(
    activeGroup.members,
    groupExpenses,
    groupSettlements
  );
  const myNetBalance = groupBalances[user.id]?.netBalance || 0;
  const groupTotalSpent = groupExpenses.reduce((acc, curr) => acc + curr.grandTotal, 0);
  const myShareTotal = groupBalances[user.id]?.totalShare || 0;

  // Active Theme Config
  const themeConfig = THEME_CONFIGS[user.theme || 'black'] || THEME_CONFIGS.black;
  const isLight = themeConfig.isLight;

  // Handlers
  const handleSaveExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    if (editingExpense) {
      // Update existing
      const updatedExpense: Expense = {
        ...expenseData,
        id: editingExpense.id,
        createdAt: editingExpense.createdAt,
      };
      setExpenses((prev) =>
        prev.map((e) => (e.id === editingExpense.id ? updatedExpense : e))
      );

      const activity: ActivityItem = {
        id: `act_${Date.now()}`,
        groupId: activeGroup.id,
        actorName: user.name,
        action: 'update_expense',
        title: `Updated bill: ${expenseData.title}`,
        description: `Modified split for ${formatMoney(
          expenseData.grandTotal,
          expenseData.currency
        )}`,
        timestamp: new Date().toISOString(),
        amount: expenseData.grandTotal,
        currency: expenseData.currency,
      };
      setActivities((prev) => [activity, ...prev]);
      setEditingExpense(null);
    } else {
      // Create new
      const newExpense: Expense = {
        ...expenseData,
        id: `exp_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setExpenses((prev) => [newExpense, ...prev]);

      const activity: ActivityItem = {
        id: `act_${Date.now()}`,
        groupId: activeGroup.id,
        actorName: user.name,
        action: 'create_expense',
        title: `Added bill: ${expenseData.title}`,
        description: `${expenseData.splitMethod === 'by_items' ? 'Itemized by dish' : 'Uneven split'} (${formatMoney(
          expenseData.grandTotal,
          expenseData.currency
        )})`,
        timestamp: new Date().toISOString(),
        amount: expenseData.grandTotal,
        currency: expenseData.currency,
      };
      setActivities((prev) => [activity, ...prev]);

      const notif: InAppNotification = {
        id: `notif_${Date.now()}`,
        title: `New Bill Added: ${expenseData.title}`,
        message: `Total: ${formatMoney(
          expenseData.grandTotal,
          expenseData.currency
        )}. Your calculated share: ${formatMoney(
          expenseData.memberShares[user.id] || 0,
          expenseData.currency
        )}`,
        timestamp: new Date().toISOString(),
        read: false,
        type: 'bill_added',
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const handleDeleteExpense = (expenseId: string) => {
    const expense = expenses.find((e) => e.id === expenseId);
    if (!expense) return;
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));

    const activity: ActivityItem = {
      id: `act_${Date.now()}`,
      groupId: activeGroup.id,
      actorName: user.name,
      action: 'delete_expense',
      title: `Deleted expense: ${expense.title}`,
      description: `Removed from ${activeGroup.name}`,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [activity, ...prev]);
  };

  const handleConfirmSettlement = (
    settlementData: Omit<Settlement, 'id' | 'status'>
  ) => {
    const newSettlement: Settlement = {
      ...settlementData,
      id: `settle_${Date.now()}`,
      status: 'settled',
    };
    setSettlements((prev) => [newSettlement, ...prev]);

    const payer = activeGroup.members.find((m) => m.id === settlementData.fromMemberId);
    const receiver = activeGroup.members.find((m) => m.id === settlementData.toMemberId);

    const activity: ActivityItem = {
      id: `act_${Date.now()}`,
      groupId: activeGroup.id,
      actorName: payer?.name || 'Member',
      action: 'settle_up',
      title: `${payer?.name.split(' ')[0]} paid ${receiver?.name.split(' ')[0]} ${formatMoney(
        settlementData.amount,
        settlementData.currency
      )}`,
      description: `Settled via ${settlementData.paymentMethod.toUpperCase()}${
        settlementData.transactionRef ? ` (Ref: ${settlementData.transactionRef})` : ''
      }`,
      timestamp: new Date().toISOString(),
      amount: settlementData.amount,
      currency: settlementData.currency,
    };
    setActivities((prev) => [activity, ...prev]);

    const notif: InAppNotification = {
      id: `notif_${Date.now()}`,
      title: `Payment Received: ${formatMoney(
        settlementData.amount,
        settlementData.currency
      )}`,
      message: `${payer?.name} paid ${receiver?.name} via ${settlementData.paymentMethod.toUpperCase()}.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'settled',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleAddMemberToGroup = (newMember: GroupMember) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== activeGroup.id) return g;
        return {
          ...g,
          members: [...g.members, newMember],
        };
      })
    );

    const activity: ActivityItem = {
      id: `act_${Date.now()}`,
      groupId: activeGroup.id,
      actorName: user.name,
      action: 'member_added',
      title: `${newMember.name} joined ${activeGroup.name}`,
      description: 'Onboarded via invite QR code / search',
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [activity, ...prev]);
  };

  const handleSendReminderNudge = (debtor: GroupMember, message: string) => {
    const activity: ActivityItem = {
      id: `act_${Date.now()}`,
      groupId: activeGroup.id,
      actorName: user.name,
      action: 'reminder_sent',
      title: `Reminder sent to ${debtor.name}`,
      description: `Gentle reminder for outstanding debt in ${activeGroup.name}`,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [activity, ...prev]);

    const notif: InAppNotification = {
      id: `notif_${Date.now()}`,
      title: `Balance Reminder Sent`,
      message: `Prompted ${debtor.name} for ${formatMoney(
        reminderConfig.amount,
        activeGroup.currency
      )}.`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'debt_reminder',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleSendMessage = (msg: Omit<GroupChatMessage, 'id' | 'timestamp'>) => {
    const newMsg: GroupChatMessage = {
      ...msg,
      id: `msg_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  const handleLogin = (signedInUser: UserProfile) => {
    setUser({ ...signedInUser, isAuthenticated: true });
    const activity: ActivityItem = {
      id: `act_${Date.now()}`,
      groupId: activeGroup.id,
      actorName: signedInUser.name,
      action: 'member_added',
      title: `${signedInUser.name} signed in`,
      description: `Active session started (${signedInUser.email})`,
      timestamp: new Date().toISOString(),
    };
    setActivities((prev) => [activity, ...prev]);
  };

  const handleLogout = () => {
    setUser((prev) => ({
      ...prev,
      isAuthenticated: false,
    }));
  };

  const handleChangeTheme = (newTheme: ColorTheme) => {
    setUser((prev) => ({
      ...prev,
      theme: newTheme,
    }));
  };

  return (
    <div
      className={`min-h-screen relative flex flex-col font-serif selection:bg-emerald-500 selection:text-white transition-colors duration-300 overflow-x-hidden ${themeConfig.bgClass}`}
    >
      {/* Ambient Colorful Background Glowing Orbs */}
      <div
        className={`absolute -top-24 -left-24 w-[380px] sm:w-[600px] h-[380px] sm:h-[600px] rounded-full blur-[110px] pointer-events-none opacity-60 transition-all duration-700 ${themeConfig.ambientGlow1}`}
      />
      <div
        className={`absolute top-1/4 -right-20 w-[350px] sm:w-[550px] h-[350px] sm:h-[550px] rounded-full blur-[130px] pointer-events-none opacity-50 transition-all duration-700 ${themeConfig.ambientGlow2}`}
      />
      <div
        className={`absolute bottom-32 left-10 w-[320px] sm:w-[480px] h-[320px] sm:h-[480px] rounded-full blur-[120px] pointer-events-none opacity-40 transition-all duration-700 ${themeConfig.ambientGlow1}`}
      />

      {/* Top Navigation */}
      <Navbar
        groups={groups}
        activeGroup={activeGroup}
        onSelectGroup={(g) => setActiveGroupId(g.id)}
        onCreateGroupClick={() => setIsCreateGroupOpen(true)}
        user={user}
        notifications={notifications}
        onMarkNotificationAsRead={(id) =>
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          )
        }
        onClearNotifications={() => setNotifications([])}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenSecurity={() => setIsSecurityOpen(true)}
        onOpenForex={() => setIsForexOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        selectedCurrency={selectedCurrency}
        onChangeCurrency={(code) => setSelectedCurrency(code)}
        onChangeTheme={handleChangeTheme}
      />

      {/* Main Content Area (generous padding bottom for mobile bottom-bar) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6 pb-28 lg:pb-8 relative z-10">
        {/* Active Group Hero Header */}
        <div
          className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border shadow-xl relative overflow-hidden transition-colors ${
            isLight
              ? 'bg-white/90 border-slate-200 shadow-slate-200/50'
              : `${themeConfig.cardBgClass} ${themeConfig.cardBorderClass}`
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
            {/* Group Identity */}
            <div className="flex items-center gap-3.5 sm:gap-4">
              <div
                className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-inner flex-shrink-0 border ${
                  isLight
                    ? 'bg-slate-100 border-slate-200'
                    : 'bg-slate-800 border-slate-700'
                }`}
              >
                {activeGroup.emoji}
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1
                    className={`text-lg sm:text-2xl font-extrabold tracking-tight truncate ${
                      isLight ? 'text-slate-900' : 'text-white'
                    }`}
                  >
                    {activeGroup.name}
                  </h1>
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    {activeGroup.category}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold uppercase px-2 py-0.5 rounded-full border font-mono opacity-80">
                    {activeGroup.currency}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2.5">
                  <span>{activeGroup.members.length} Members</span>
                  <span>•</span>
                  <span className="font-mono">Code: {activeGroup.inviteCode}</span>
                </div>
              </div>
            </div>

            {/* Quick Action CTA Buttons with 2x2 grid on mobile for plenty of space */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
              <button
                onClick={() => setIsScannerOpen(true)}
                className={`px-3 sm:px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 transition active:scale-[0.99] min-h-[44px] ${themeConfig.accentBtnClass}`}
              >
                <Camera className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Scan Receipt (OCR)</span>
              </button>

              <button
                onClick={() => {
                  setEditingExpense(null);
                  setIsExpenseModalOpen(true);
                }}
                className={`px-3 sm:px-4 py-2.5 rounded-xl border font-semibold text-xs flex items-center justify-center gap-1.5 transition active:scale-[0.99] min-h-[44px] ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                    : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200'
                }`}
              >
                <Plus className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Add Bill</span>
              </button>

              <button
                onClick={() => {
                  setSettleConfig({});
                  setIsSettleModalOpen(true);
                }}
                className={`px-3 sm:px-4 py-2.5 rounded-xl border font-semibold text-xs flex items-center justify-center gap-1.5 transition active:scale-[0.99] min-h-[44px] ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                    : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-200'
                }`}
              >
                <CreditCard className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                <span>Settle Up</span>
              </button>

              <button
                onClick={() => setIsInviteModalOpen(true)}
                className={`px-3 sm:px-3.5 py-2.5 rounded-xl border font-medium text-xs flex items-center justify-center gap-1.5 transition active:scale-[0.99] min-h-[44px] ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                    : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300'
                }`}
                title="Invite Members with QR"
              >
                <QrCode className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Invite QR</span>
              </button>
            </div>
          </div>

          {/* Group Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-5 pt-4 border-t border-slate-700/40 text-xs">
            <div
              className={`p-3 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-slate-800/60'
              }`}
            >
              <span className="text-[11px] text-slate-400 block">Total Spent</span>
              <span className="text-base sm:text-lg font-bold font-mono mt-0.5 block">
                {formatMoney(groupTotalSpent, activeGroup.currency)}
              </span>
            </div>

            <div
              className={`p-3 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-slate-800/60'
              }`}
            >
              <span className="text-[11px] text-slate-400 block">Your Share</span>
              <span className="text-base sm:text-lg font-bold font-mono mt-0.5 block">
                {formatMoney(myShareTotal, activeGroup.currency)}
              </span>
            </div>

            <div
              className={`p-3 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-slate-800/60'
              }`}
            >
              <span className="text-[11px] text-slate-400 block">Net Balance</span>
              <span
                className={`text-base sm:text-lg font-bold font-mono mt-0.5 block ${
                  myNetBalance > 0.01
                    ? 'text-emerald-500'
                    : myNetBalance < -0.01
                    ? 'text-rose-500'
                    : 'text-slate-400'
                }`}
              >
                {myNetBalance > 0.01 ? '+' : ''}
                {formatMoney(myNetBalance, activeGroup.currency)}
              </span>
            </div>

            <div
              className={`p-3 rounded-xl border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/40 border-slate-800/60'
              }`}
            >
              <span className="text-[11px] text-slate-400 block">Group Chat</span>
              <span
                onClick={() => setActiveTab('chat')}
                className="text-xs font-semibold text-emerald-500 mt-1 block flex items-center gap-1.5 cursor-pointer hover:underline"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{groupChatMessages.length} messages</span>
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Navigation Tabs (Hidden on mobile, mobile uses bottom bar) */}
        <div className="hidden lg:flex border-b border-slate-700/50 gap-4 overflow-x-auto pb-px">
          {[
            { id: 'expenses', label: 'Expenses & Dishes', icon: Receipt },
            { id: 'balances', label: 'Balances & Settle', icon: Scale },
            {
              id: 'chat',
              label: `Group Chat (${groupChatMessages.length})`,
              icon: MessageSquare,
            },
            { id: 'activity', label: 'Activity Log', icon: History },
            { id: 'members', label: 'Group Members', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3.5 text-sm font-semibold border-b-2 transition whitespace-nowrap ${
                  active
                    ? 'border-emerald-500 text-emerald-500'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        {activeTab === 'expenses' && (
          <ExpenseList
            group={activeGroup}
            currentUser={user}
            expenses={groupExpenses}
            onEditExpense={(exp) => {
              setEditingExpense(exp);
              setIsExpenseModalOpen(true);
            }}
            onDeleteExpense={handleDeleteExpense}
            onScanReceiptClick={() => setIsScannerOpen(true)}
            onAddExpenseClick={() => {
              setEditingExpense(null);
              setIsExpenseModalOpen(true);
            }}
          />
        )}

        {activeTab === 'balances' && (
          <BalancesView
            group={activeGroup}
            currentUser={user}
            expenses={groupExpenses}
            settlements={groupSettlements}
            onOpenSettleModal={(payerId, receiverId, amount) => {
              setSettleConfig({ payerId, receiverId, amount });
              setIsSettleModalOpen(true);
            }}
            onOpenReminderModal={(debtor, amount) => {
              setReminderConfig({
                isOpen: true,
                debtor,
                amount,
              });
            }}
          />
        )}

        {activeTab === 'chat' && (
          <GroupChat
            group={activeGroup}
            currentUser={user}
            expenses={groupExpenses}
            messages={chatMessages}
            onSendMessage={handleSendMessage}
            onClearChat={() =>
              setChatMessages((prev) =>
                prev.filter((m) => m.groupId !== activeGroup.id)
              )
            }
          />
        )}

        {activeTab === 'activity' && (
          <ActivityFeed group={activeGroup} activities={activities} />
        )}

        {activeTab === 'members' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className={`text-base font-bold flex items-center gap-2 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  <Users className="w-4 h-4 text-emerald-500" />
                  <span>Group Members & Friends ({activeGroup.members.length})</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Friends onboarded with custom UPI, PayPal, and Venmo handles
                </p>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Member</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeGroup.members.map((member) => (
                <div
                  key={member.id}
                  className={`p-4 rounded-xl border space-y-3 transition ${
                    isLight
                      ? 'bg-white border-slate-200 shadow-sm'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-emerald-500/30"
                    />
                    <div className="min-w-0 flex-1">
                      <div
                        className={`font-bold text-sm truncate flex items-center gap-1.5 ${
                          isLight ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        <span>{member.name}</span>
                        {member.id === user.id && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-500 font-normal">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {member.phone || member.email || 'No phone set'}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-2.5 rounded-lg border text-xs font-mono space-y-1 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-800/60 border-slate-750'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">UPI VPA:</span>
                      <span className="text-emerald-500 truncate max-w-[170px] font-semibold">
                        {member.upiId || 'Not configured'}
                      </span>
                    </div>
                    {member.paypalHandle && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">PayPal:</span>
                        <span className="text-cyan-500 truncate">
                          @{member.paypalHandle}
                        </span>
                      </div>
                    )}
                    {member.venmoTag && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Venmo:</span>
                        <span className="text-sky-500 truncate">
                          @{member.venmoTag}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* FOOTER & COMPETITION WATERMARK */}
      <footer
        className={`w-full py-6 border-t text-xs transition-colors mb-16 lg:mb-0 ${
          isLight
            ? 'bg-slate-100/80 border-slate-200 text-slate-600'
            : 'bg-black/30 border-slate-850 text-slate-400'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold opacity-80">EquiSplit</span>
            <span>•</span>
            <span className="text-[11px] opacity-70">
              Smart Bill Splitter, OCR & Multi-Currency Expense Engine
            </span>
          </div>

          {/* Requested Competition Watermark Text */}
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-mono text-[11px] border tracking-wider select-none ${
              isLight
                ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-sm'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30 shadow-sm'
            }`}
          >
            <span className="opacity-80">Competition ID:</span>
            <span className="font-bold font-mono tracking-widest text-amber-400">
              ZC-F126B7EEE4E0
            </span>
          </div>
        </div>
      </footer>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-xl border-t px-2 py-2 shadow-2xl flex items-center justify-around ${
          isLight
            ? 'bg-white/95 border-slate-200 text-slate-600 shadow-slate-300'
            : `${themeConfig.cardBgClass} border-slate-800 text-slate-400 shadow-black`
        }`}
      >
        {[
          { id: 'expenses', label: 'Expenses', icon: Receipt },
          { id: 'balances', label: 'Balances', icon: Scale },
          {
            id: 'chat',
            label: 'Chat',
            icon: MessageSquare,
            badge: groupChatMessages.length,
          },
          { id: 'activity', label: 'History', icon: History },
          { id: 'members', label: 'Members', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 min-w-[56px] min-h-[48px] rounded-xl transition ${
                active
                  ? `${themeConfig.accentTextClass} font-bold scale-105`
                  : 'hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5 flex-shrink-0" />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[15px] h-3.5 px-0.5 bg-emerald-500 text-white rounded-full text-[9px] flex items-center justify-center font-bold shadow-md">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* DESKTOP FLOATING CHAT BUTTON (If not currently on chat tab) */}
      {activeTab !== 'chat' && (
        <div className="hidden lg:block fixed bottom-6 right-6 z-40">
          <button
            onClick={() => setIsChatFloatingOpen(!isChatFloatingOpen)}
            className="p-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl flex items-center gap-2.5 transition active:scale-95 ring-4 ring-emerald-500/20"
            title="Open Group Chat"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs font-bold font-sans">
              Chat ({groupChatMessages.length})
            </span>
          </button>

          {/* Floating Chat Drawer */}
          {isChatFloatingOpen && (
            <div className="absolute bottom-16 right-0 w-96 rounded-2xl shadow-2xl border overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-4 duration-150">
              <GroupChat
                group={activeGroup}
                currentUser={user}
                expenses={groupExpenses}
                messages={chatMessages}
                onSendMessage={handleSendMessage}
              />
            </div>
          )}
        </div>
      )}

      {/* ALL MODALS */}
      {/* 1. Camera Receipt OCR Scanner */}
      <CameraReceiptScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        group={activeGroup}
        currentUser={user}
        onSaveExpense={handleSaveExpense}
      />

      {/* 2. Manual / Edit Bill Expense Modal */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setEditingExpense(null);
        }}
        group={activeGroup}
        currentUser={user}
        onSaveExpense={handleSaveExpense}
        initialExpense={editingExpense}
      />

      {/* 3. Settle Up Direct Payments */}
      <SettleUpModal
        isOpen={isSettleModalOpen}
        onClose={() => setIsSettleModalOpen(false)}
        group={activeGroup}
        currentUser={user}
        defaultPayerId={settleConfig.payerId}
        defaultReceiverId={settleConfig.receiverId}
        defaultAmount={settleConfig.amount}
        onConfirmSettlement={handleConfirmSettlement}
      />

      {/* 4. Group Onboarding & Invite QR Modal */}
      <GroupInviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        group={activeGroup}
        onAddMember={handleAddMemberToGroup}
      />

      {/* 5. Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        currentUser={user}
        onCreateGroup={(newGrp) => {
          setGroups((prev) => [newGrp, ...prev]);
          setActiveGroupId(newGrp.id);
        }}
      />

      {/* 6. User Profile & Payment Setup Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onSaveProfile={(updated) => setUser(updated)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* 7. Forex Calculator Modal */}
      <ForexCalculatorModal
        isOpen={isForexOpen}
        onClose={() => setIsForexOpen(false)}
        baseCurrency={selectedCurrency}
      />

      {/* 8. Security Modal */}
      <SecurityModal
        isOpen={isSecurityOpen}
        onClose={() => setIsSecurityOpen(false)}
      />

      {/* 9. Authentication Modal (Sign In / Switch / Logout) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* 10. Courteous Reminder Modal */}
      {reminderConfig.debtor && (
        <ReminderModal
          isOpen={reminderConfig.isOpen}
          onClose={() =>
            setReminderConfig({ isOpen: false, debtor: null, amount: 0 })
          }
          group={activeGroup}
          currentUser={user}
          debtor={reminderConfig.debtor}
          amountOwed={reminderConfig.amount}
          onSendReminder={handleSendReminderNudge}
        />
      )}
    </div>
  );
}
