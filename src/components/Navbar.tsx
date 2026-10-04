import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Bell,
  ShieldCheck,
  Wifi,
  WifiOff,
  Coins,
  ChevronDown,
  CheckCircle2,
  Trash2,
  Sparkles,
  Palette,
  LogIn,
  LogOut,
  MessageSquare,
  Award,
  X,
} from 'lucide-react';
import { BillSplitLogo } from './BillSplitLogo';
import {
  ColorTheme,
  CurrencyCode,
  Group,
  InAppNotification,
  SUPPORTED_CURRENCIES,
  UserProfile,
} from '../types';
import { THEME_CONFIGS } from '../utils/theme';

interface NavbarProps {
  groups: Group[];
  activeGroup: Group | null;
  onSelectGroup: (group: Group) => void;
  onCreateGroupClick: () => void;
  user: UserProfile;
  notifications: InAppNotification[];
  onMarkNotificationAsRead: (id: string) => void;
  onClearNotifications: () => void;
  onOpenProfile: () => void;
  onOpenSecurity: () => void;
  onOpenForex: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  selectedCurrency: CurrencyCode;
  onChangeCurrency: (code: CurrencyCode) => void;
  onChangeTheme: (theme: ColorTheme) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  groups,
  activeGroup,
  onSelectGroup,
  onCreateGroupClick,
  user,
  notifications,
  onMarkNotificationAsRead,
  onClearNotifications,
  onOpenProfile,
  onOpenSecurity,
  onOpenForex,
  onOpenAuth,
  onLogout,
  selectedCurrency,
  onChangeCurrency,
  onChangeTheme,
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showGroupMenu, setShowGroupMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const closeAllMenus = () => {
    setShowGroupMenu(false);
    setShowNotifMenu(false);
    setShowCurrencyMenu(false);
    setShowThemeMenu(false);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const currentCurr =
    SUPPORTED_CURRENCIES.find((c) => c.code === selectedCurrency) ||
    SUPPORTED_CURRENCIES[0];

  const currentTheme = THEME_CONFIGS[user.theme || 'orange'] || THEME_CONFIGS.orange;
  const isLightMode = currentTheme?.isLight;

  return (
    <>
      {/* Mobile Backdrop for all dropdown menus */}
      {(showGroupMenu || showNotifMenu || showCurrencyMenu || showThemeMenu) && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs sm:hidden animate-in fade-in duration-150"
          onClick={closeAllMenus}
        />
      )}

      <header
        className={`sticky top-0 z-40 w-full backdrop-blur-xl border-b shadow-lg transition-colors duration-200 ${
          isLightMode
            ? 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-200/50'
            : `${currentTheme.headerBgClass} shadow-black/40`
        }`}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-1.5 sm:gap-4">
          {/* Brand & Group Selector */}
          <div className="flex items-center gap-1.5 sm:gap-4 md:gap-6 min-w-0">
            <div
              onClick={onOpenProfile}
              className="flex items-center gap-2 cursor-pointer select-none flex-shrink-0"
              title="View Profile & Settings"
            >
              <BillSplitLogo className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0" />
              <div className="hidden md:block">
                <div
                  className={`font-bold text-base sm:text-lg tracking-tight ${
                    isLightMode ? 'text-slate-900' : 'text-white'
                  }`}
                >
                  EquiSplit
                </div>
                <p className="text-[10px] text-emerald-500 font-medium tracking-wide -mt-1 uppercase">
                  AI OCR & Bill Splitter
                </p>
              </div>
            </div>

            {/* Competition Watermark Pill (Desktop) */}
            <div
              title="Verified Competition Entry: ZC-F126B7EEE4E0"
              className={`hidden 2xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border select-none ${
                isLightMode
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              }`}
            >
              <Award className="w-3 h-3 text-amber-400" />
              <span>ID: ZC-F126B7EEE4E0</span>
            </div>

            {/* Active Group Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  const nextState = !showGroupMenu;
                  closeAllMenus();
                  setShowGroupMenu(nextState);
                }}
                className={`flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-medium transition max-w-[115px] xs:max-w-[150px] sm:max-w-[200px] md:max-w-xs min-h-[38px] ${
                  isLightMode
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                    : 'bg-slate-800/80 hover:bg-slate-750 border-slate-700/80 text-slate-200 hover:text-white'
                }`}
              >
                <span className="text-base leading-none flex-shrink-0">
                  {activeGroup?.emoji || '👥'}
                </span>
                <span className="truncate">
                  {activeGroup?.name || 'Select Group'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60 flex-shrink-0 ml-0.5" />
              </button>

              {/* Group Dropdown: Fits 100% in mobile screen layout */}
              {showGroupMenu && (
                <div
                  className={`fixed inset-x-3 top-18 sm:top-full sm:mt-2 sm:absolute sm:inset-auto sm:left-0 sm:w-72 backdrop-blur-xl border rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-[75vh] flex flex-col ${
                    isLightMode
                      ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300'
                      : 'bg-slate-900/98 border-slate-750 text-white shadow-black'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-700/40">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Your Groups ({groups.length})
                    </span>
                    <button
                      onClick={() => setShowGroupMenu(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white sm:hidden"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="overflow-y-auto space-y-1.5 py-2 flex-1">
                    {groups.map((grp) => {
                      const isSelected = activeGroup?.id === grp.id;
                      return (
                        <button
                          key={grp.id}
                          onClick={() => {
                            onSelectGroup(grp);
                            setShowGroupMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between text-xs sm:text-sm transition ${
                            isSelected
                              ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30'
                              : isLightMode
                              ? 'text-slate-700 hover:bg-slate-100'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="text-lg flex-shrink-0">{grp.emoji}</span>
                            <div className="truncate">
                              <div className="truncate font-semibold">{grp.name}</div>
                              <div className="text-[11px] text-slate-400">
                                {grp.members.length} members • {grp.currency}
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="pt-2 border-t border-slate-700/50">
                    <button
                      onClick={() => {
                        setShowGroupMenu(false);
                        onCreateGroupClick();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition border border-emerald-500/30 min-h-[40px]"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create New Group</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Action Tools - No overlapping, ample touch targets */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* THEME COLOR OPTION BUTTON */}
            <div className="relative">
              <button
                onClick={() => {
                  const nextState = !showThemeMenu;
                  closeAllMenus();
                  setShowThemeMenu(nextState);
                }}
                title={`Theme: ${currentTheme?.name}`}
                className={`flex items-center justify-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-medium transition min-h-[38px] min-w-[38px] ${
                  isLightMode
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                    : 'bg-slate-800/80 hover:bg-slate-750 border-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <Palette className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span
                  className="w-3 h-3 rounded-full border border-white/30 hidden xs:inline-block shadow-sm flex-shrink-0"
                  style={{ backgroundColor: currentTheme?.previewColor }}
                />
                <span className="hidden xl:inline">{currentTheme?.name}</span>
              </button>

              {/* Theme Dropdown: Fits 100% inside screen on mobile */}
              {showThemeMenu && (
                <div
                  className={`fixed inset-x-3 top-18 sm:top-full sm:mt-2 sm:absolute sm:inset-auto sm:right-0 sm:w-72 backdrop-blur-xl border rounded-2xl shadow-2xl p-3.5 z-50 animate-in fade-in zoom-in-95 duration-100 max-h-[80vh] overflow-y-auto ${
                    isLightMode
                      ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300'
                      : 'bg-slate-900/98 border-slate-750 text-white shadow-black'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-700/40">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        App Color Theme
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Choose your personalized background & accents
                      </div>
                    </div>
                    <button
                      onClick={() => setShowThemeMenu(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white sm:hidden"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 pt-2.5">
                    {(Object.keys(THEME_CONFIGS) as ColorTheme[]).map((tKey) => {
                      const t = THEME_CONFIGS[tKey];
                      const isSelected = user.theme === tKey;
                      return (
                        <button
                          key={tKey}
                          onClick={() => {
                            onChangeTheme(tKey);
                            setShowThemeMenu(false);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition min-h-[42px] ${
                            isSelected
                              ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40 shadow-sm'
                              : isLightMode
                              ? 'text-slate-700 hover:bg-slate-100 border border-slate-200'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span
                              className="w-4 h-4 rounded-full border border-slate-500 shadow-sm flex-shrink-0"
                              style={{ backgroundColor: t.previewColor }}
                            />
                            <div className="truncate text-left">
                              <div className="truncate font-semibold">{t.name}</div>
                              <div className="text-[9px] text-slate-400 truncate">
                                {t.badge}
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 ml-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* USD / CURRENCY OPTION BUTTON */}
            <div className="relative">
              <button
                onClick={() => {
                  const nextState = !showCurrencyMenu;
                  closeAllMenus();
                  setShowCurrencyMenu(nextState);
                }}
                className={`flex items-center justify-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition min-h-[38px] ${
                  isLightMode
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                    : 'bg-slate-800/80 hover:bg-slate-750 border-slate-700 text-slate-200 hover:text-white'
                }`}
                title="Change Currency"
              >
                <span className="text-sm leading-none flex-shrink-0">
                  {currentCurr.flag}
                </span>
                <span className="font-mono text-xs">{currentCurr.code}</span>
              </button>

              {/* Currency Dropdown: Fits 100% inside screen on mobile */}
              {showCurrencyMenu && (
                <div
                  className={`fixed inset-x-3 top-18 sm:top-full sm:mt-2 sm:absolute sm:inset-auto sm:right-0 sm:w-64 backdrop-blur-xl border rounded-2xl shadow-2xl p-3 z-50 max-h-[75vh] flex flex-col ${
                    isLightMode
                      ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300'
                      : 'bg-slate-900/98 border-slate-750 text-white shadow-black'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-700/40">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Active Currency
                    </span>
                    <button
                      onClick={() => setShowCurrencyMenu(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white sm:hidden"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="overflow-y-auto space-y-1 py-2 flex-1">
                    {SUPPORTED_CURRENCIES.map((curr) => {
                      const isSelected = selectedCurrency === curr.code;
                      return (
                        <button
                          key={curr.code}
                          onClick={() => {
                            onChangeCurrency(curr.code);
                            setShowCurrencyMenu(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition min-h-[38px] ${
                            isSelected
                              ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30'
                              : isLightMode
                              ? 'text-slate-700 hover:bg-slate-100'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">{curr.flag}</span>
                            <span className="font-medium">{curr.name}</span>
                          </div>
                          <span className="font-mono font-bold text-slate-400">
                            {curr.symbol} {curr.code}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Forex Quick Tool (Desktop) */}
            <button
              onClick={onOpenForex}
              title="Forex & Currency Converter"
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition min-h-[38px] ${
                isLightMode
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                  : 'bg-slate-800/80 hover:bg-slate-750 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>Forex</span>
            </button>

            {/* NOTIFICATION OPTION BUTTON */}
            <div className="relative">
              <button
                onClick={() => {
                  const nextState = !showNotifMenu;
                  closeAllMenus();
                  setShowNotifMenu(nextState);
                }}
                className={`relative p-2 rounded-xl border transition min-h-[38px] min-w-[38px] flex items-center justify-center ${
                  isLightMode
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                    : 'bg-slate-800/80 hover:bg-slate-750 border-slate-700 text-slate-300 hover:text-white'
                }`}
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-pulse shadow-md">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover: Fits 100% inside screen on mobile */}
              {showNotifMenu && (
                <div
                  className={`fixed inset-x-3 top-18 sm:top-full sm:mt-2 sm:absolute sm:inset-auto sm:right-0 sm:w-96 backdrop-blur-xl border rounded-2xl shadow-2xl p-3 z-50 max-h-[80vh] flex flex-col ${
                    isLightMode
                      ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300'
                      : 'bg-slate-900/98 border-slate-750 text-white shadow-black'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-700/50">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs sm:text-sm font-bold">
                        Notifications & Reminders
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {notifications.length > 0 && (
                        <button
                          onClick={onClearNotifications}
                          className="text-xs text-slate-400 hover:text-rose-500 flex items-center gap-1 transition"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Clear</span>
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifMenu(false)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white sm:hidden"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-y-auto space-y-2 py-2 flex-1">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8 text-xs text-slate-400">
                        No notifications yet. You're all caught up!
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => onMarkNotificationAsRead(n.id)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                            n.read
                              ? isLightMode
                                ? 'bg-slate-50 border-slate-200 text-slate-600'
                                : 'bg-slate-800/40 border-slate-800 text-slate-400'
                              : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-medium'
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold mb-0.5">
                            <span>{n.title}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(n.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                          <p className="text-slate-400 leading-relaxed text-[11px]">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* USER PROFILE AVATAR / SIGN IN */}
            {user.isAuthenticated ? (
              <button
                onClick={onOpenProfile}
                className={`flex items-center gap-1.5 pl-1 pr-1.5 sm:pr-2.5 py-1 rounded-full border transition group min-h-[38px] ${
                  isLightMode
                    ? 'bg-slate-100 hover:bg-slate-200 border-slate-300'
                    : 'bg-slate-800/90 hover:bg-slate-750 border-slate-700'
                }`}
                title="Profile & Payment Setup"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500/50"
                  />
                  {user.isPhoneVerified && (
                    <span
                      title="Phone Verified"
                      className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-1 ring-slate-900"
                    />
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-semibold max-w-[80px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition min-h-[38px]"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};
