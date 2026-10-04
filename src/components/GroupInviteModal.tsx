import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Copy,
  Check,
  UserPlus,
  Search,
  Users,
  Sparkles,
  Share2,
} from 'lucide-react';
import QRCode from 'qrcode';
import { Group, GroupMember } from '../types';

interface GroupInviteModalProps {
  group: Group;
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (member: GroupMember) => void;
}

const PRESET_FRIENDS: GroupMember[] = [
  {
    id: 'friend_liam',
    name: 'Liam Chen',
    email: 'liam.chen@example.com',
    phone: '+1 (555) 891-2345',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    upiId: 'liamchen@okicici',
    venmoTag: 'liam-chen-sf',
  },
  {
    id: 'friend_emma',
    name: 'Emma Watson',
    email: 'emma.watson@example.com',
    phone: '+1 (555) 678-9012',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    upiId: 'emmawatson@okhdfcbank',
    paypalHandle: 'emmawatson',
  },
  {
    id: 'friend_carlos',
    name: 'Carlos Rivera',
    email: 'carlos.r@example.com',
    phone: '+1 (555) 432-1098',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    upiId: 'carlos@okaxis',
    venmoTag: 'carlos-rivera',
  },
  {
    id: 'friend_aisha',
    name: 'Aisha Patel',
    email: 'aisha.p@example.com',
    phone: '+91 98200 12345',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    upiId: 'aishapatel@okhdfcbank',
  },
];

export const GroupInviteModal: React.FC<GroupInviteModalProps> = ({
  group,
  isOpen,
  onClose,
  onAddMember,
}) => {
  const [tab, setTab] = useState<'qr' | 'friends' | 'custom'>('qr');
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Custom friend form
  const [customName, setCustomName] = useState('');
  const [customPhone, setCustomPhone] = useState('');
  const [customUpi, setCustomUpi] = useState('');

  const inviteLink = `${window.location.origin}/join/${group.inviteCode}`;

  useEffect(() => {
    if (!isOpen) return;
    const invitePayload = JSON.stringify({
      action: 'join_group',
      groupId: group.id,
      inviteCode: group.inviteCode,
      name: group.name,
      currency: group.currency,
    });

    QRCode.toDataURL(invitePayload, {
      width: 260,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrUrl(url))
      .catch((err) => console.error(err));
  }, [group, isOpen]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newMember: GroupMember = {
      id: `member_${Date.now()}`,
      name: customName.trim(),
      phone: customPhone.trim() || undefined,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(customName)}`,
      upiId: customUpi.trim() || undefined,
    };

    onAddMember(newMember);
    setCustomName('');
    setCustomPhone('');
    setCustomUpi('');
    onClose();
  };

  const existingMemberIds = new Set(group.members.map((m) => m.id));
  const availableFriends = PRESET_FRIENDS.filter(
    (f) =>
      !existingMemberIds.has(f.id) &&
      (f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.email?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
                Add Members & Invite QR
              </h2>
              <p className="text-xs text-slate-400">{group.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 p-2 gap-1">
          <button
            onClick={() => setTab('qr')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
              tab === 'qr'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Invite QR Code</span>
          </button>
          <button
            onClick={() => setTab('friends')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
              tab === 'friends'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Friends Search</span>
          </button>
          <button
            onClick={() => setTab('custom')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 ${
              tab === 'custom'
                ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add by Phone / UPI</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {tab === 'qr' && (
            <div className="text-center space-y-4">
              <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-200 inline-block mx-auto">
                {qrUrl ? (
                  <img
                    src={qrUrl}
                    alt="Group Invite QR Code"
                    className="w-48 h-48 object-contain"
                  />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center">
                    <QrCode className="w-12 h-12 text-slate-400 animate-pulse" />
                  </div>
                )}
                <div className="text-[11px] font-bold text-slate-900 mt-2">
                  CODE: {group.inviteCode}
                </div>
              </div>

              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Scan with any smartphone camera or QR scanner for seamless group
                onboarding without typing IDs!
              </p>

              {/* Copy Shareable Link */}
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800 border border-slate-700">
                <input
                  type="text"
                  readOnly
                  value={inviteLink}
                  className="bg-transparent text-xs text-slate-300 px-2 flex-1 focus:outline-none truncate font-mono"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition flex-shrink-0"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {tab === 'friends' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search friends by name or email..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availableFriends.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No matching friends found or all friends already in this group.
                  </div>
                ) : (
                  availableFriends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-750 hover:border-slate-700 transition"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={friend.avatar}
                          alt={friend.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="text-xs font-semibold text-white">
                            {friend.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {friend.phone || friend.email} • {friend.upiId || 'No UPI'}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onAddMember(friend);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-medium border border-emerald-500/30 flex items-center gap-1 transition"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {tab === 'custom' && (
            <form onSubmit={handleAddCustom} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  placeholder="e.g. +1 555-0192 or +91 98765 43210"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  UPI ID (Optional for fast settlements)
                </label>
                <input
                  type="text"
                  value={customUpi}
                  onChange={(e) => setCustomUpi(e.target.value)}
                  placeholder="e.g. sarah@oksbi"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-md transition active:scale-[0.99] flex items-center justify-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Member to Group</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
