import React from 'react';
import clsx from 'clsx';
import { Heart, Zap, Thermometer, Utensils } from 'lucide-react';

interface StatusBarProps {
  label: string;
  value: number;
  maxValue: number;
  icon: React.ElementType;
  colorClass: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ label, value, maxValue, icon: Icon, colorClass }) => {
  const percentage = Math.min(100, Math.max(0, (value / maxValue) * 100));
  
  return (
    <div className="flex flex-col w-full mb-2">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center text-slate-300">
          <Icon className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-xs text-slate-400">{Math.round(value)}/{maxValue}</span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-2.5">
        <div 
          className={clsx("h-2.5 rounded-full transition-all duration-500", colorClass)} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

interface StatusPanelProps {
  hunger: number;
  comfort: number;
  health: number;
  energy: number;
}

export const StatusPanel: React.FC<StatusPanelProps> = ({ hunger, comfort, health, energy }) => {
  const getHealthColor = (val: number) => {
    if (val > 70) return 'bg-green-500';
    if (val > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getHungerColor = (val: number) => {
      // High hunger value is good (full), low is bad
    if (val > 70) return 'bg-green-500';
    if (val > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700">
      <h3 className="text-lg font-semibold text-slate-100 mb-4 border-b border-slate-700 pb-2">状态</h3>
      <div className="space-y-4">
        <StatusBar 
          label="生命" 
          value={health} 
          maxValue={100} 
          icon={Heart} 
          colorClass={getHealthColor(health)} 
        />
        <StatusBar 
          label="饱食度" 
          value={hunger} 
          maxValue={100} 
          icon={Utensils} 
          colorClass={getHungerColor(hunger)} 
        />
        <StatusBar 
          label="舒适度" 
          value={comfort} 
          maxValue={100} 
          icon={Thermometer} 
          colorClass="bg-blue-400" 
        />
        <StatusBar 
          label="体力" 
          value={energy} 
          maxValue={100} 
          icon={Zap} 
          colorClass="bg-yellow-400" 
        />
      </div>
    </div>
  );
};
