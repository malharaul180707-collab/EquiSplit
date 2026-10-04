import React from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  EyeOff,
  ServerOff,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl text-white overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                End-to-End Encryption & Security
              </h2>
              <p className="text-xs text-slate-400">
                How EquiSplit safeguards your payment details and data
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

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3">
            <Lock className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-bold text-emerald-300">
                Zero-Knowledge Payment Storage
              </span>
              <p className="text-slate-300 leading-relaxed">
                Your UPI IDs, PayPal usernames, Venmo tags, and Net Banking account
                numbers are stored locally inside your browser's encrypted sandbox.
                We never store or log your banking passwords, MPINs, or private
                keys.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                icon: EyeOff,
                title: 'Client-Side Masking & Data Isolation',
                desc: 'Sensitive banking details are masked by default and require explicit user taps to reveal or copy.',
              },
              {
                icon: Smartphone,
                title: 'Direct App-to-App UPI & Deep Links',
                desc: 'Transfers execute directly inside official banking apps (GPay, PhonePe, Paytm, Venmo) via standard cryptographic deep links without intermediaries.',
              },
              {
                icon: ServerOff,
                title: 'Ephemeral Multimodal AI OCR',
                desc: 'Receipt photos sent to the Gemini 3.8 vision engine are processed in memory and never persisted or shared with third parties.',
              },
              {
                icon: CheckCircle2,
                title: 'Offline-First Resilience',
                desc: 'All calculations, receipt splits, and balances function 100% offline without needing an active server connection.',
              },
            ].map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-750"
                >
                  <Icon className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5 text-xs">
                    <div className="font-semibold text-white">{feat.title}</div>
                    <div className="text-slate-400 leading-relaxed">
                      {feat.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white transition"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
};
