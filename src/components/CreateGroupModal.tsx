import React, { useState } from 'react';
import {
  X,
  Users,
  Sparkles,
  Plane,
  Utensils,
  PartyPopper,
  Home,
  Check,
} from 'lucide-react';
import {
  CurrencyCode,
  Group,
  GroupCategory,
  SUPPORTED_CURRENCIES,
  UserProfile,
} from '../types';

interface CreateGroupModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (newGroup: Group) => void;
}

const EMOJIS = ['🍝', '🏖️', '🍕', '🍻', '🎉', '✈️', '🏕️', '🏠', '🍣', '☕', '🚗', '🎸'];

const CATEGORIES: { id: GroupCategory; label: string; icon: any }[] = [
  { id: 'restaurant', label: 'Restaurant & Dining', icon: Utensils },
  { id: 'trip', label: 'Trip & Vacation', icon: Plane },
  { id: 'event', label: 'Event & Party', icon: PartyPopper },
  { id: 'home', label: 'Home & Roommates', icon: Home },
  { id: 'other', label: 'Other Outing', icon: Sparkles },
];

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onCreateGroup,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<GroupCategory>('restaurant');
  const [emoji, setEmoji] = useState('🍝');
  const [currency, setCurrency] = useState<CurrencyCode>(currentUser.preferredCurrency);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const inviteCode = `${name.slice(0, 4).toUpperCase().replace(/[^A-Z]/g, 'GRP')}-${randomSuffix}`;

    const newGroup: Group = {
      id: `group_${Date.now()}`,
      name: name.trim(),
      category,
      emoji,
      currency,
      createdAt: new Date().toISOString(),
      inviteCode,
      members: [
        {
          id: currentUser.id,
          name: `${currentUser.name} (You)`,
          email: currentUser.email,
          phone: currentUser.phone,
          avatar: currentUser.avatar,
          isCurrentUser: true,
          upiId: currentUser.paymentDetails.upiId,
          paypalHandle: currentUser.paymentDetails.paypalHandle,
          venmoTag: currentUser.paymentDetails.venmoTag,
          bankDetails: currentUser.paymentDetails.bankDetails,
        },
      ],
    };

    onCreateGroup(newGroup);
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl text-white overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Create New Group
              </h2>
              <p className="text-xs text-slate-400">
                Split restaurant bills, vacation trips, and everyday expenses
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Emoji selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Choose Group Icon:
            </label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setEmoji(e)}
                  className={`w-10 h-10 rounded-xl text-lg flex items-center justify-center transition border ${
                    emoji === e
                      ? 'bg-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500/40'
                      : 'bg-slate-800 border-slate-700 hover:bg-slate-750'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Group Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Group Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Barcelona Trip, Sushi Dinner, Flatmates"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setCategory(cat.id);
                      if (cat.id === 'restaurant') setEmoji('🍝');
                      if (cat.id === 'trip') setEmoji('🏖️');
                      if (cat.id === 'event') setEmoji('🎉');
                      if (cat.id === 'home') setEmoji('🏠');
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                        : 'bg-slate-800/80 hover:bg-slate-750 text-slate-400 border-slate-700'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="truncate">{cat.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Currency */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">
              Group Base Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.code} ({c.symbol}) - {c.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              All member balances in this group will be tracked in this currency.
            </p>
          </div>

          {/* Footer buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs shadow-md transition active:scale-[0.99] flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Create Group</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
