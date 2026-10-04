import React, { useState } from 'react';
import {
  X,
  User,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Mail,
  CreditCard,
  Building,
  KeyRound,
  Check,
  Lock,
  Palette,
  LogOut,
  LogIn,
} from 'lucide-react';
import { ColorTheme, UserProfile } from '../types';
import { THEME_CONFIGS } from '../utils/theme';

interface UserProfileModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (updated: UserProfile) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  user,
  isOpen,
  onClose,
  onSaveProfile,
  onOpenAuth,
  onLogout,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [theme, setTheme] = useState<ColorTheme>(user.theme || 'orange');
  const [isPhoneVerified, setIsPhoneVerified] = useState(user.isPhoneVerified);
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState<string | null>(null);

  // Payment details
  const [upiId, setUpiId] = useState(user.paymentDetails.upiId || '');
  const [paypalHandle, setPaypalHandle] = useState(user.paymentDetails.paypalHandle || '');
  const [venmoTag, setVenmoTag] = useState(user.paymentDetails.venmoTag || '');
  const [bankName, setBankName] = useState(user.paymentDetails.bankDetails?.bankName || '');
  const [accountNumber, setAccountNumber] = useState(
    user.paymentDetails.bankDetails?.accountNumber || ''
  );
  const [ifscOrIban, setIfscOrIban] = useState(
    user.paymentDetails.bankDetails?.ifscOrIban || ''
  );

  if (!isOpen) return null;

  const handleStartPhoneVerification = () => {
    setShowOtpScreen(true);
    setOtpError(null);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      setOtpError('Please enter the 4-digit verification code.');
      return;
    }
    setIsPhoneVerified(true);
    setShowOtpScreen(false);
    setOtpCode('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...user,
      name: name.trim() || user.name,
      email: email.trim() || user.email,
      phone: phone.trim() || user.phone,
      theme,
      isPhoneVerified,
      paymentDetails: {
        upiId: upiId.trim() || undefined,
        paypalHandle: paypalHandle.trim() || undefined,
        venmoTag: venmoTag.trim() || undefined,
        bankDetails: {
          accountHolder: name,
          bankName: bankName.trim() || 'Chase / HDFC Bank',
          accountNumber: accountNumber.trim() || '•••• 4892',
          ifscOrIban: ifscOrIban.trim() || 'HDFC0001234',
        },
      },
    };

    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 w-full max-w-xl rounded-3xl shadow-2xl text-white overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh]">
        {/* Header with generous touch targets */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Account & Color Theme
              </h2>
              <p className="text-xs text-slate-400">
                Personalize themes, authentication, and payment handles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body with generous mobile breathing room */}
        <form
          onSubmit={handleSave}
          className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-6 sm:space-y-7 pb-8"
        >
          {/* User Profile Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/70 border border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover ring-2 ring-emerald-500/50 shadow-md flex-shrink-0"
              />
              <div className="space-y-1 min-w-0">
                <div className="text-sm sm:text-base font-bold text-white truncate flex items-center gap-2">
                  <span>{name}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {user.isAuthenticated ? 'Logged In' : 'Guest'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 truncate flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span className="truncate">{email}</span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-2 pt-0.5">
                  <Smartphone className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span>{phone}</span>
                  {isPhoneVerified ? (
                    <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleStartPhoneVerification}
                      className="text-[11px] text-amber-400 hover:underline font-bold"
                    >
                      Verify Now
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Auth Actions: Switch / Sign In / Logout */}
            <div className="flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-700/60 justify-end">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-750 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 min-h-[38px]"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>Switch Account</span>
              </button>

              {user.isAuthenticated && (
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 min-h-[38px]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              )}
            </div>
          </div>

          {/* COLOR THEME SELECTOR with rich previews and ample touch space */}
          <div className="space-y-3.5 p-4 sm:p-5 rounded-2xl bg-slate-800/50 border border-slate-750">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Palette className="w-4 h-4 text-emerald-400" />
                <span>Colorful App Background & Theme</span>
              </label>
              <span className="text-xs font-semibold text-emerald-400">
                {THEME_CONFIGS[theme]?.name}
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Select your favorite vibrant palette to transform background
              atmospheres, buttons, and accents.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-1">
              {(Object.keys(THEME_CONFIGS) as ColorTheme[]).map((themeKey) => {
                const conf = THEME_CONFIGS[themeKey];
                const isSelected = theme === themeKey;
                return (
                  <button
                    key={themeKey}
                    type="button"
                    onClick={() => setTheme(themeKey)}
                    className={`p-3 sm:p-3.5 rounded-2xl border text-left flex items-center justify-between gap-2.5 transition active:scale-95 min-h-[50px] ${
                      isSelected
                        ? 'border-emerald-500 ring-2 ring-emerald-500/40 bg-slate-850 shadow-lg font-bold'
                        : 'border-slate-700 bg-slate-900/80 hover:border-slate-600 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className="w-5 h-5 rounded-full border border-white/30 shadow-inner flex-shrink-0"
                        style={{ backgroundColor: conf.previewColor }}
                      />
                      <div className="truncate">
                        <div className="text-xs font-bold truncate">
                          {conf.name}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate">
                          {conf.badge}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* OTP Verification if triggered */}
          {showOtpScreen && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Verify Phone Number via OTP</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setShowOtpScreen(false)}
                  className="text-xs text-slate-400 hover:text-white p-1"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-slate-300">
                A 4-digit code was sent to <strong className="text-white">{phone}</strong> (Demo code: <span className="text-emerald-400 font-mono font-bold">5829</span>).
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={4}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="5829"
                  className="w-32 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-center text-sm font-mono font-bold text-white focus:outline-none focus:border-amber-500 tracking-widest"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition min-h-[42px]"
                >
                  Confirm Code
                </button>
              </div>
              {otpError && <p className="text-xs text-rose-400">{otpError}</p>}
            </div>
          )}

          {/* Contact Details with ample tap height */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 sm:py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 min-h-[42px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setIsPhoneVerified(false);
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 sm:py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 min-h-[42px]"
              />
            </div>
          </div>

          {/* Payment Platform Handles */}
          <div className="space-y-4 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Payment Settlement Handles</span>
              </h3>
              <span className="text-[11px] text-slate-400">
                For 1-tap friends payment
              </span>
            </div>

            {/* UPI ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                UPI Virtual Payment Address (GPay / PhonePe / Paytm / CRED)
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="e.g. yourname@okhdfcbank"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-emerald-500 min-h-[42px]"
              />
            </div>

            {/* PayPal and Venmo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  PayPal.me Username
                </label>
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 min-h-[42px]">
                  <span className="text-xs text-slate-500 mr-1">paypal.me/</span>
                  <input
                    type="text"
                    value={paypalHandle}
                    onChange={(e) => setPaypalHandle(e.target.value)}
                    placeholder="username"
                    className="w-full bg-transparent text-xs text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Venmo Tag
                </label>
                <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 min-h-[42px]">
                  <span className="text-xs text-slate-500 mr-1">@</span>
                  <input
                    type="text"
                    value={venmoTag}
                    onChange={(e) => setVenmoTag(e.target.value)}
                    placeholder="venmo-handle"
                    className="w-full bg-transparent text-xs text-white font-mono focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Net Banking Details */}
            <div className="space-y-3.5 p-4 rounded-2xl bg-slate-800/40 border border-slate-750">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-emerald-400" />
                <span>Net Banking / Bank Wire Details (Encrypted)</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="e.g. Chase / HDFC"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 min-h-[38px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="e.g. •••• 4892"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500 min-h-[38px]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">IFSC / IBAN / Routing</label>
                  <input
                    type="text"
                    value={ifscOrIban}
                    onChange={(e) => setIfscOrIban(e.target.value)}
                    placeholder="e.g. HDFC0001234"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500 min-h-[38px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer buttons with full mobile width and thumb reachability */}
          <div className="pt-4 border-t border-slate-800 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition min-h-[44px] flex items-center justify-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 transition active:scale-[0.99] flex items-center justify-center gap-2 min-h-[46px]"
            >
              <Check className="w-4 h-4" />
              <span>Apply Theme & Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
