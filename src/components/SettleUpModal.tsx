import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Copy,
  ExternalLink,
  QrCode,
  CreditCard,
  Building,
  Smartphone,
  Check,
  Sparkles,
} from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { Group, GroupMember, Settlement, UserProfile } from '../types';
import { formatMoney } from '../utils/forex';

interface SettleUpModalProps {
  group: Group;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  defaultPayerId?: string;
  defaultReceiverId?: string;
  defaultAmount?: number;
  onConfirmSettlement: (settlement: Omit<Settlement, 'id' | 'status'>) => void;
}

export const SettleUpModal: React.FC<SettleUpModalProps> = ({
  group,
  currentUser,
  isOpen,
  onClose,
  defaultPayerId,
  defaultReceiverId,
  defaultAmount = 0,
  onConfirmSettlement,
}) => {
  const [payerId, setPayerId] = useState(defaultPayerId || currentUser.id);
  const [receiverId, setReceiverId] = useState(
    defaultReceiverId || group.members.find((m) => m.id !== currentUser.id)?.id || ''
  );
  const [amount, setAmount] = useState(defaultAmount);
  const [selectedMethod, setSelectedMethod] = useState<
    'upi' | 'paypal' | 'venmo' | 'netbanking' | 'cash'
  >('upi');
  const [transactionRef, setTransactionRef] = useState('');
  const [notes, setNotes] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const receiver = group.members.find((m) => m.id === receiverId);
  const payer = group.members.find((m) => m.id === payerId);

  useEffect(() => {
    if (defaultPayerId) setPayerId(defaultPayerId);
    if (defaultReceiverId) setReceiverId(defaultReceiverId);
    if (defaultAmount > 0) setAmount(defaultAmount);
  }, [defaultPayerId, defaultReceiverId, defaultAmount, isOpen]);

  // Generate QR Code dynamically based on payment method and receiver details
  useEffect(() => {
    if (!receiver) return;

    let payload = '';

    if (selectedMethod === 'upi') {
      const upiId = receiver.upiId || 'payee@okhdfcbank';
      const payeeName = encodeURIComponent(receiver.name);
      const note = encodeURIComponent(`EquiSplit: ${group.name}`);
      // Standard NPCI UPI URI
      payload = `upi://pay?pa=${upiId}&pn=${payeeName}&am=${amount.toFixed(2)}&cu=${group.currency === 'INR' ? 'INR' : 'INR'}&tn=${note}`;
    } else if (selectedMethod === 'paypal') {
      const handle = receiver.paypalHandle || 'user';
      payload = `https://paypal.me/${handle}/${amount.toFixed(2)}${group.currency}`;
    } else if (selectedMethod === 'venmo') {
      const tag = receiver.venmoTag || 'user';
      payload = `https://venmo.com/${tag}?txn=pay&amount=${amount.toFixed(2)}&note=EquiSplit`;
    } else {
      payload = `Payment of ${formatMoney(amount, group.currency)} to ${receiver.name} for ${group.name}`;
    }

    QRCode.toDataURL(payload, {
      width: 250,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Failed to generate QR code:', err));
  }, [receiver, amount, selectedMethod, group]);

  if (!isOpen || !receiver) return null;

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSettle = () => {
    // Fire festive celebration confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    onConfirmSettlement({
      groupId: group.id,
      fromMemberId: payerId,
      toMemberId: receiverId,
      amount: Number(amount.toFixed(2)),
      currency: group.currency,
      paymentMethod: selectedMethod,
      transactionRef: transactionRef.trim() || undefined,
      notes: notes.trim() || undefined,
      date: new Date().toISOString().split('T')[0],
    });

    onClose();
  };

  const upiId = receiver.upiId || `${receiver.name.toLowerCase().replace(/\s+/g, '')}@okaxis`;
  const upiDeepLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(receiver.name)}&am=${amount.toFixed(2)}&cu=${group.currency === 'INR' ? 'INR' : 'INR'}&tn=${encodeURIComponent(`EquiSplit: ${group.name}`)}`;
  const paypalLink = receiver.paypalHandle ? `https://paypal.me/${receiver.paypalHandle}/${amount.toFixed(2)}${group.currency}` : `https://paypal.me/${receiver.name.toLowerCase().replace(/\s+/g, '')}`;
  const venmoLink = receiver.venmoTag ? `https://venmo.com/${receiver.venmoTag}?txn=pay&amount=${amount.toFixed(2)}&note=EquiSplit` : `https://venmo.com/${receiver.name.toLowerCase().replace(/\s+/g, '')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl text-white overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Settle Balance & Direct Transfer
              </h2>
              <p className="text-xs text-slate-400">
                UPI QR, PayPal, Venmo, or Net Banking direct payment
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
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Payer, Receiver, and Amount */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-800/60 p-4 rounded-xl border border-slate-750">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase text-slate-400">
                Who is paying?
              </label>
              <select
                value={payerId}
                onChange={(e) => setPayerId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {group.members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase text-slate-400">
                Paying to:
              </label>
              <select
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                {group.members
                  .filter((m) => m.id !== payerId)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase text-slate-400">
                Amount ({group.currency})
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-base font-bold font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Payment Platform Selector Tabs */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Select Payment Platform
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'upi', label: 'UPI / GPay / PhonePe', icon: Smartphone },
                { id: 'paypal', label: 'PayPal', icon: CreditCard },
                { id: 'venmo', label: 'Venmo', icon: Smartphone },
                { id: 'netbanking', label: 'Net Banking', icon: Building },
                { id: 'cash', label: 'Cash / Other', icon: CheckCircle2 },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = selectedMethod === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedMethod(tab.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 text-xs ${
                      active
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 font-bold shadow-md'
                        : 'bg-slate-800/80 hover:bg-slate-750 text-slate-400 border-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Platform Specific Details Card */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/80 space-y-4">
            {/* UPI Option */}
            {selectedMethod === 'upi' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {qrDataUrl && (
                    <div className="bg-white p-3 rounded-2xl shadow-xl border border-slate-200 flex-shrink-0 text-center">
                      <img
                        src={qrDataUrl}
                        alt="UPI Payment QR Code"
                        className="w-40 h-40 object-contain mx-auto"
                      />
                      <span className="text-[10px] text-slate-600 font-semibold block mt-1">
                        Scan with Google Pay, PhonePe, Paytm, CRED
                      </span>
                    </div>
                  )}

                  <div className="space-y-3 flex-1 text-left w-full">
                    <div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Payee UPI Virtual Payment Address (VPA):
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-sm text-emerald-400 font-semibold flex-1 truncate">
                          {upiId}
                        </code>
                        <button
                          onClick={() => copyToClipboard(upiId, 'upi')}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition"
                        >
                          {copiedField === 'upi' ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <a
                      href={upiDeepLink}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Open Installed UPI App (GPay / PhonePe)</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* PayPal Option */}
            {selectedMethod === 'paypal' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {qrDataUrl && (
                    <div className="bg-white p-3 rounded-2xl shadow-xl border border-slate-200 flex-shrink-0 text-center">
                      <img
                        src={qrDataUrl}
                        alt="PayPal QR Code"
                        className="w-40 h-40 object-contain mx-auto"
                      />
                      <span className="text-[10px] text-slate-600 font-semibold block mt-1">
                        Scan with camera to pay
                      </span>
                    </div>
                  )}

                  <div className="space-y-3 flex-1 text-left w-full">
                    <div>
                      <span className="text-[11px] text-slate-400">
                        PayPal.me Handle:
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-sm text-cyan-400 font-semibold flex-1 truncate">
                          paypal.me/{receiver.paypalHandle || receiver.name.toLowerCase().replace(/\s+/g, '')}
                        </code>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              `paypal.me/${receiver.paypalHandle || receiver.name.toLowerCase().replace(/\s+/g, '')}`,
                              'paypal'
                            )
                          }
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition"
                        >
                          {copiedField === 'paypal' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <a
                      href={paypalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Pay via PayPal.me</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Venmo Option */}
            {selectedMethod === 'venmo' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {qrDataUrl && (
                    <div className="bg-white p-3 rounded-2xl shadow-xl border border-slate-200 flex-shrink-0 text-center">
                      <img
                        src={qrDataUrl}
                        alt="Venmo QR Code"
                        className="w-40 h-40 object-contain mx-auto"
                      />
                      <span className="text-[10px] text-slate-600 font-semibold block mt-1">
                        Scan to open in Venmo
                      </span>
                    </div>
                  )}

                  <div className="space-y-3 flex-1 text-left w-full">
                    <div>
                      <span className="text-[11px] text-slate-400">
                        Venmo Username:
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-sm text-cyan-400 font-semibold flex-1 truncate">
                          @{receiver.venmoTag || receiver.name.toLowerCase().replace(/\s+/g, '')}
                        </code>
                        <button
                          onClick={() =>
                            copyToClipboard(
                              `@${receiver.venmoTag || receiver.name.toLowerCase().replace(/\s+/g, '')}`,
                              'venmo'
                            )
                          }
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition"
                        >
                          {copiedField === 'venmo' ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <a
                      href={venmoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Open in Venmo</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Net Banking Option */}
            {selectedMethod === 'netbanking' && (
              <div className="space-y-3">
                <span className="text-xs font-semibold text-slate-300">
                  Beneficiary Bank Account Details (Encrypted):
                </span>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-750 space-y-2.5 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Account Holder:</span>
                    <span className="font-semibold text-white">{receiver.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Bank Name:</span>
                    <span className="text-white">
                      {receiver.bankDetails?.bankName || 'JPMorgan Chase / HDFC Bank'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Account Number:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">
                        {receiver.bankDetails?.accountNumber || '987654321048'}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            receiver.bankDetails?.accountNumber || '987654321048',
                            'bankAcc'
                          )
                        }
                        className="p-1 hover:text-emerald-400"
                        title="Copy account number"
                      >
                        {copiedField === 'bankAcc' ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">IFSC / IBAN / Routing:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-400">
                        {receiver.bankDetails?.ifscOrIban || 'HDFC0001234'}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            receiver.bankDetails?.ifscOrIban || 'HDFC0001234',
                            'ifsc'
                          )
                        }
                        className="p-1 hover:text-emerald-400"
                        title="Copy IFSC / IBAN"
                      >
                        {copiedField === 'ifsc' ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cash / Other */}
            {selectedMethod === 'cash' && (
              <div className="p-4 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-sm font-semibold text-white">
                  Handed Over Cash or Paid Directly in Person
                </p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Clicking below will record this payment in the group transaction
                  history and bring both balances to zero.
                </p>
              </div>
            )}
          </div>

          {/* Optional Transaction ID / Note */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Transaction Ref / UPI UTR / PayPal ID (Optional)
              </label>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="e.g. UPI-294829103 or Ref #481"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">
                Settlement Note (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Paid for dinner & drinks"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
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
            onClick={handleSettle}
            disabled={amount <= 0}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition active:scale-[0.99] flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Mark Balance as Settled</span>
          </button>
        </div>
      </div>
    </div>
  );
};
