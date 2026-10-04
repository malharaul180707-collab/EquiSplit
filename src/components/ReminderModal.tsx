import React, { useState } from 'react';
import {
  X,
  BellRing,
  Send,
  Copy,
  Check,
  MessageSquare,
  Mail,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { Group, GroupMember, UserProfile } from '../types';
import { formatMoney } from '../utils/forex';

interface ReminderModalProps {
  group: Group;
  currentUser: UserProfile;
  debtor: GroupMember;
  amountOwed: number;
  isOpen: boolean;
  onClose: () => void;
  onSendReminder: (debtor: GroupMember, message: string) => void;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  group,
  currentUser,
  debtor,
  amountOwed,
  isOpen,
  onClose,
  onSendReminder,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const paymentHandle =
    currentUser.paymentDetails.upiId ||
    currentUser.paymentDetails.paypalHandle ||
    currentUser.paymentDetails.venmoTag ||
    'our EquiSplit link';

  const defaultMessage = `Hey ${debtor.name.split(' ')[0]}! Gentle reminder about the balance of ${formatMoney(
    amountOwed,
    group.currency
  )} for "${group.name}". Whenever convenient, you can settle up via ${paymentHandle}. Thanks!`;

  const [message, setMessage] = useState(defaultMessage);

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleSMS = () => {
    const url = `sms:${debtor.phone || ''}?body=${encodeURIComponent(message)}`;
    window.location.href = url;
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`EquiSplit Balance Reminder: ${group.name}`);
    const body = encodeURIComponent(message);
    const url = `mailto:${debtor.email || ''}?subject=${subject}&body=${body}`;
    window.location.href = url;
  };

  const handleSendNudge = () => {
    onSendReminder(debtor, message);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl text-white overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Send Courteous Debt Reminder
              </h2>
              <p className="text-xs text-slate-400">
                Remind {debtor.name} for {formatMoney(amountOwed, group.currency)}
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

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-750">
            <img
              src={debtor.avatar}
              alt={debtor.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <div className="text-sm font-bold text-white">{debtor.name}</div>
              <div className="text-xs text-amber-400 font-semibold font-mono">
                Outstanding Balance: {formatMoney(amountOwed, group.currency)}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Personalized Courteous Reminder Message:
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed resize-none"
            />
          </div>

          {/* Direct External Share Options */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Send Via:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={handleWhatsApp}
                className="py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={handleSMS}
                className="py-2.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>SMS Text</span>
              </button>

              <button
                type="button"
                onClick={handleEmail}
                className="py-2.5 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email</span>
              </button>

              <button
                type="button"
                onClick={handleCopy}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSendNudge}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition active:scale-[0.99] flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" />
            <span>Send In-App Nudge</span>
          </button>
        </div>
      </div>
    </div>
  );
};
