import { ColorTheme } from '../types';

export interface ThemeConfig {
  id: ColorTheme;
  name: string;
  badge: string;
  bgClass: string;
  ambientGlow1: string;
  ambientGlow2: string;
  cardBgClass: string;
  cardBorderClass: string;
  headerBgClass: string;
  textPrimaryClass: string;
  textMutedClass: string;
  accentBtnClass: string;
  accentTextClass: string;
  accentBadgeClass: string;
  previewColor: string;
  isLight?: boolean;
}

export const THEME_CONFIGS: Record<ColorTheme, ThemeConfig> = {
  orange: {
    id: 'orange',
    name: 'Sunset Coral',
    badge: '🍊 Vibrant Orange',
    bgClass: 'bg-gradient-to-br from-[#2a170d] via-[#1a0f09] to-[#0f0805] text-amber-50',
    ambientGlow1: 'bg-gradient-to-tr from-amber-500/20 to-orange-500/25',
    ambientGlow2: 'bg-gradient-to-br from-rose-500/15 to-amber-600/20',
    cardBgClass: 'bg-[#21140e]/95 backdrop-blur-xl',
    cardBorderClass: 'border-orange-500/30 shadow-orange-950/40',
    headerBgClass: 'bg-[#21140e]/95 border-orange-500/25 text-amber-50',
    textPrimaryClass: 'text-amber-50',
    textMutedClass: 'text-amber-200/70',
    accentBtnClass: 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 hover:from-orange-400 hover:to-amber-400 text-stone-950 font-bold shadow-lg shadow-orange-500/30',
    accentTextClass: 'text-amber-400',
    accentBadgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/40 font-semibold',
    previewColor: '#f97316',
    isLight: false,
  },
  emerald: {
    id: 'emerald',
    name: 'Emerald Lagoon',
    badge: '🌿 Vibrant Green',
    bgClass: 'bg-gradient-to-br from-[#07241c] via-[#051913] to-[#030d0a] text-emerald-50',
    ambientGlow1: 'bg-gradient-to-tr from-emerald-500/25 to-teal-400/20',
    ambientGlow2: 'bg-gradient-to-br from-cyan-500/20 to-emerald-600/20',
    cardBgClass: 'bg-[#0b2920]/95 backdrop-blur-xl',
    cardBorderClass: 'border-emerald-500/30 shadow-emerald-950/40',
    headerBgClass: 'bg-[#0b2920]/95 border-emerald-500/25 text-emerald-50',
    textPrimaryClass: 'text-emerald-50',
    textMutedClass: 'text-emerald-200/70',
    accentBtnClass: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-400 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/30',
    accentTextClass: 'text-emerald-400',
    accentBadgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold',
    previewColor: '#10b981',
    isLight: false,
  },
  indigo: {
    id: 'indigo',
    name: 'Electric Neon',
    badge: '🔮 Cyber Indigo',
    bgClass: 'bg-gradient-to-br from-[#151336] via-[#0d0c24] to-[#070614] text-indigo-50',
    ambientGlow1: 'bg-gradient-to-tr from-indigo-500/25 to-purple-500/25',
    ambientGlow2: 'bg-gradient-to-br from-cyan-500/15 to-indigo-600/25',
    cardBgClass: 'bg-[#1b1945]/95 backdrop-blur-xl',
    cardBorderClass: 'border-indigo-500/30 shadow-indigo-950/40',
    headerBgClass: 'bg-[#1b1945]/95 border-indigo-500/25 text-indigo-50',
    textPrimaryClass: 'text-indigo-50',
    textMutedClass: 'text-indigo-200/70',
    accentBtnClass: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold shadow-lg shadow-indigo-500/30',
    accentTextClass: 'text-indigo-400',
    accentBadgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 font-semibold',
    previewColor: '#6366f1',
    isLight: false,
  },
  crimson: {
    id: 'crimson',
    name: 'Ruby Blaze',
    badge: '🍷 Vibrant Crimson',
    bgClass: 'bg-gradient-to-br from-[#2a0e19] via-[#1a080f] to-[#0d0407] text-rose-50',
    ambientGlow1: 'bg-gradient-to-tr from-rose-500/25 to-pink-500/20',
    ambientGlow2: 'bg-gradient-to-br from-amber-500/15 to-rose-600/25',
    cardBgClass: 'bg-[#29101a]/95 backdrop-blur-xl',
    cardBorderClass: 'border-rose-500/30 shadow-rose-950/40',
    headerBgClass: 'bg-[#29101a]/95 border-rose-500/25 text-rose-50',
    textPrimaryClass: 'text-rose-50',
    textMutedClass: 'text-rose-200/70',
    accentBtnClass: 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 hover:from-rose-400 hover:to-pink-400 text-white font-bold shadow-lg shadow-rose-500/30',
    accentTextClass: 'text-rose-400',
    accentBadgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-semibold',
    previewColor: '#f43f5e',
    isLight: false,
  },
  white: {
    id: 'white',
    name: 'Luminous Opal',
    badge: '☀️ Bright Pastel',
    bgClass: 'bg-gradient-to-br from-sky-50 via-teal-50/50 to-amber-50/60 text-slate-900',
    ambientGlow1: 'bg-gradient-to-tr from-teal-200/40 to-sky-200/40',
    ambientGlow2: 'bg-gradient-to-br from-amber-200/30 to-emerald-200/30',
    cardBgClass: 'bg-white/90 backdrop-blur-xl',
    cardBorderClass: 'border-slate-200 shadow-md shadow-slate-200/50',
    headerBgClass: 'bg-white/95 border-slate-200 text-slate-900',
    textPrimaryClass: 'text-slate-900',
    textMutedClass: 'text-slate-600',
    accentBtnClass: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-md shadow-emerald-600/20',
    accentTextClass: 'text-emerald-700',
    accentBadgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold',
    previewColor: '#ffffff',
    isLight: true,
  },
  black: {
    id: 'black',
    name: 'Aurora Obsidian',
    badge: '🌑 Deep Midnight',
    bgClass: 'bg-gradient-to-br from-[#0c1524] via-[#090e17] to-[#04070c] text-slate-100',
    ambientGlow1: 'bg-gradient-to-tr from-teal-500/15 to-emerald-500/15',
    ambientGlow2: 'bg-gradient-to-br from-indigo-500/15 to-cyan-500/15',
    cardBgClass: 'bg-[#111927]/95 backdrop-blur-xl',
    cardBorderClass: 'border-slate-800 shadow-xl shadow-black/40',
    headerBgClass: 'bg-[#111927]/95 border-slate-800 text-white',
    textPrimaryClass: 'text-white',
    textMutedClass: 'text-slate-400',
    accentBtnClass: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold shadow-lg shadow-emerald-500/25',
    accentTextClass: 'text-emerald-400',
    accentBadgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-semibold',
    previewColor: '#0c1524',
    isLight: false,
  },
};
