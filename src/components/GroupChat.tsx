import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Sparkles,
  Receipt,
  Smile,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { Expense, Group, GroupChatMessage, UserProfile } from '../types';

interface GroupChatProps {
  group: Group;
  currentUser: UserProfile;
  expenses: Expense[];
  messages: GroupChatMessage[];
  onSendMessage: (msg: Omit<GroupChatMessage, 'id' | 'timestamp'>) => void;
  onClearChat?: () => void;
}

const QUICK_PROMPTS = [
  '🧾 Who wants to split the appetizers?',
  '💸 Just settled up via UPI!',
  '🍕 That pizza was amazing!',
  '👋 Reminder: please check your bill share.',
];

export const GroupChat: React.FC<GroupChatProps> = ({
  group,
  currentUser,
  expenses,
  messages,
  onSendMessage,
  onClearChat,
}) => {
  const [text, setText] = useState('');
  const [selectedExpenseTitle, setSelectedExpenseTitle] = useState<string | ''>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const groupMessages = messages.filter((m) => m.groupId === group.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [groupMessages.length]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSendMessage({
      groupId: group.id,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      text: text.trim(),
      referencedExpenseTitle: selectedExpenseTitle || undefined,
    });

    setText('');
    setSelectedExpenseTitle('');
  };

  return (
    <div className="flex flex-col h-[600px] rounded-2xl bg-slate-900 border border-slate-850 shadow-xl overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>{group.name} Chat</span>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {group.members.length} members
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Discuss dishes, coordinate payments, and clarify split shares
            </p>
          </div>
        </div>

        {groupMessages.length > 0 && onClearChat && (
          <button
            onClick={onClearChat}
            className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1 transition"
            title="Clear Chat History"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {groupMessages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-white">No messages yet</h4>
              <p className="text-xs text-slate-400 max-w-xs">
                Start the conversation with your group members about the bill or
                trip plans.
              </p>
            </div>
          </div>
        ) : (
          groupMessages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full object-cover flex-shrink-0 mt-0.5 ring-1 ring-slate-700"
                />

                <div
                  className={`max-w-[78%] sm:max-w-md space-y-1 ${
                    isMe ? 'items-end text-right' : 'items-start text-left'
                  }`}
                >
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">
                      {isMe ? 'You' : msg.senderName}
                    </span>
                    <span className="text-[10px]">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  {msg.referencedExpenseTitle && (
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-medium border ${
                        isMe
                          ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-300'
                      }`}
                    >
                      <Receipt className="w-3 h-3 text-emerald-400" />
                      <span>Ref: {msg.referencedExpenseTitle}</span>
                    </div>
                  )}

                  <div
                    className={`p-3 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-emerald-600 text-white rounded-tr-none shadow-md'
                        : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-750'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800 flex gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => setText(prompt)}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-300 whitespace-nowrap transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-slate-900 border-t border-slate-800 flex flex-col gap-2"
      >
        {/* Optional Tag Bill selector */}
        {expenses.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 text-[11px]">Tag Bill:</span>
            <select
              value={selectedExpenseTitle}
              onChange={(e) => setSelectedExpenseTitle(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-0.5 text-[11px] text-slate-300 focus:outline-none"
            >
              <option value="">None (General Message)</option>
              {expenses.map((exp) => (
                <option key={exp.id} value={exp.title}>
                  {exp.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Message ${group.name}...`}
            className="flex-1 bg-slate-800 border border-slate-750 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />

          <button
            type="submit"
            disabled={!text.trim()}
            className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition active:scale-95 flex-shrink-0"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
