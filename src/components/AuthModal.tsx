import React, { useState } from 'react';
import {
  X,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  Sparkles,
  CheckCircle2,
  Users,
  LogOut,
  ArrowRight,
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

const PRESET_ACCOUNTS: UserProfile[] = [
  {
    id: 'user_raul',
    name: 'Raul Malhar',
    email: 'raulmalhar18@gmail.com',
    phone: '+1 (555) 234-8901',
    isPhoneVerified: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    preferredCurrency: 'USD',
    theme: 'black',
    isAuthenticated: true,
    paymentDetails: {
      upiId: 'raulmalhar@okhdfcbank',
      paypalHandle: 'raulmalhar',
      venmoTag: 'raul-malhar',
    },
  },
  {
    id: 'user_alex',
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 345-6789',
    isPhoneVerified: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    preferredCurrency: 'USD',
    theme: 'orange',
    isAuthenticated: true,
    paymentDetails: {
      upiId: 'alexmorgan@okhdfcbank',
      paypalHandle: 'alexmorgan88',
      venmoTag: 'alex-morgan-split',
    },
  },
  {
    id: 'user_maya',
    name: 'Maya Lin',
    email: 'maya.lin@example.com',
    phone: '+1 (555) 456-7890',
    isPhoneVerified: true,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    preferredCurrency: 'USD',
    theme: 'emerald',
    isAuthenticated: true,
    paymentDetails: {
      upiId: 'mayalin@oksbi',
      paypalHandle: 'mayalin99',
    },
  },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onLogin,
  onLogout,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'switch'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const userProfile: UserProfile = {
      id: `user_${Date.now()}`,
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      phone: '+1 (555) 000-0000',
      isPhoneVerified: false,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
        email
      )}`,
      preferredCurrency: 'USD',
      theme: 'black',
      isAuthenticated: true,
      paymentDetails: {
        upiId: `${email.split('@')[0]}@okhdfcbank`,
      },
    };

    onLogin(userProfile);
    onClose();
  };

  const handleSelectPreset = (preset: UserProfile) => {
    onLogin(preset);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl text-white overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Account Authentication
              </h2>
              <p className="text-xs text-slate-400">
                Sign in, create account, or switch active profile
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

        {/* Current status if signed in */}
        {currentUser.isAuthenticated && (
          <div className="p-4 mx-6 mt-4 rounded-xl bg-slate-800/70 border border-slate-750 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {currentUser.email}
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">
                  ● Currently Logged In
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        )}

        {/* One-Click Google / Fast Sign-in Accounts */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Quick Sign In with Google Profiles:
            </span>
            <div className="space-y-2">
              {PRESET_ACCOUNTS.map((acc) => {
                const isSelected = currentUser.email === acc.email;
                return (
                  <button
                    key={acc.id}
                    onClick={() => handleSelectPreset(acc)}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition group ${
                      isSelected
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-800/80 hover:bg-slate-750 border-slate-700 text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold truncate group-hover:text-emerald-300">
                          {acc.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {acc.email}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-3 text-[11px] text-slate-500">
              or sign in with custom credentials
            </span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Custom Sign in Form */}
          <form onSubmit={handleCustomSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Display Name (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Lee"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-md transition active:scale-[0.99] flex items-center justify-center gap-1.5 mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Create Account</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
