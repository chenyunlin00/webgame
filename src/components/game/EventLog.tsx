import React from 'react';
import { GameEventLog } from '../../types';
import clsx from 'clsx';
import { Info, AlertTriangle, CheckCircle, AlertOctagon } from 'lucide-react';

interface EventLogProps {
  logs: GameEventLog[];
}

export const EventLog: React.FC<EventLogProps> = ({ logs }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'danger': return AlertOctagon;
      default: return Info;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'danger': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden flex flex-col h-full max-h-96">
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-slate-100">事件日志</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {logs.length === 0 ? (
          <p className="text-slate-500 text-center italic">暂无事件发生</p>
        ) : (
          logs.map((log) => {
            const Icon = getIcon(log.type);
            const colorClass = getColor(log.type);
            
            return (
              <div key={log.id} className="flex items-start text-sm border-b border-slate-700/50 pb-2 last:border-0">
                <span className="text-slate-500 min-w-[3rem] mr-2">Day {log.gameDay}</span>
                <Icon className={clsx("w-4 h-4 mt-0.5 mr-2 flex-shrink-0", colorClass)} />
                <p className="text-slate-300">{log.message}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
