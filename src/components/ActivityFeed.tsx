import React from 'react';
import {
  History,
  Receipt,
  CheckCircle2,
  BellRing,
  UserPlus,
  ArrowRightLeft,
  Calendar,
} from 'lucide-react';
import { ActivityItem, Group } from '../types';
import { formatMoney } from '../utils/forex';

interface ActivityFeedProps {
  group: Group;
  activities: ActivityItem[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  group,
  activities,
}) => {
  const groupActivities = activities.filter((a) => a.groupId === group.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            <span>Activity & Transaction Audit Log</span>
          </h3>
          <p className="text-xs text-slate-400">
            Immutable history of bills, itemizations, settlements, and reminders
          </p>
        </div>
        <span className="text-xs text-slate-500 font-mono">
          {groupActivities.length} events logged
        </span>
      </div>

      {groupActivities.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
          No activity recorded in this group yet.
        </div>
      ) : (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {groupActivities.map((act) => {
            const isSettle = act.action === 'settle_up';
            const isReminder = act.action === 'reminder_sent';
            const isMember = act.action === 'member_added';

            return (
              <div key={act.id} className="relative group">
                {/* Timeline node */}
                <div
                  className={`absolute -left-6 top-1 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-slate-950 ${
                    isSettle
                      ? 'bg-emerald-500 text-white'
                      : isReminder
                      ? 'bg-amber-500 text-slate-950'
                      : isMember
                      ? 'bg-cyan-500 text-white'
                      : 'bg-teal-500 text-white'
                  }`}
                >
                  {isSettle ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : isReminder ? (
                    <BellRing className="w-3 h-3" />
                  ) : isMember ? (
                    <UserPlus className="w-3 h-3" />
                  ) : (
                    <Receipt className="w-3 h-3" />
                  )}
                </div>

                {/* Event Card */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-750 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white">
                      {act.title}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3" />
                      {new Date(act.timestamp).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      {new Date(act.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400">{act.description}</p>

                  {act.amount !== undefined && (
                    <div className="pt-1.5 flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        {formatMoney(act.amount, act.currency || group.currency)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
