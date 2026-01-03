import React from 'react';
import { useGame } from '../../context/GameContext';
import { Heart, Zap, Utensils, Smile, Thermometer } from 'lucide-react';
import clsx from 'clsx';

export const StatusBar: React.FC = () => {
  const { state } = useGame();
  const { playerState } = state;

  // Helper for progress bars
  const renderBar = (
    icon: React.ReactNode, 
    value: number, 
    max: number, 
    colorClass: string, 
    label: string,
    isTemperature: boolean = false
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    
    return (
      <div className="flex flex-col flex-1 min-w-[80px]">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <div className="flex items-center gap-1">
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </div>
          <span className="font-mono">{value}{isTemperature ? '°C' : ''}</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
            {isTemperature ? (
                 // Temperature gradient logic? Simplified for now
                 <div className="h-full w-full relative">
                     {/* Indicator */}
                     <div 
                        className="absolute top-0 bottom-0 w-1 bg-white" 
                        style={{ left: `${percentage}%` }}
                     />
                     <div className="h-full w-full bg-gradient-to-r from-blue-500 via-green-500 to-red-500 opacity-50" />
                 </div>
            ) : (
                <div 
                    className={clsx("h-full transition-all duration-500 ease-out", colorClass)}
                    style={{ width: `${percentage}%` }}
                />
            )}
        </div>
      </div>
    );
  };

  // Temperature logic: range -20 to 40 for display bar mapping?
  // Let's say -20 is 0%, 40 is 100%. Range = 60.
  // value - (-20) = value + 20. (value + 20) / 60 * 100
  const tempPercentage = ((playerState.currentTemperature + 20) / 60) * 100;

  return (
    <div className="z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-700 shadow-md px-4 md:px-8 py-3">
      <div className="max-w-4xl mx-auto flex flex-wrap gap-4 items-center justify-between">
          
          <div className="flex items-center gap-2 mr-4">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Day</span>
              <span className="text-2xl font-bold text-white font-mono">{playerState.gameDay}</span>
          </div>

          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {renderBar(
                <Heart className="w-3 h-3 text-red-500" />, 
                playerState.health, 
                100, 
                "bg-red-500", 
                "生命"
            )}
            {renderBar(
                <Utensils className="w-3 h-3 text-orange-500" />, 
                playerState.hunger, 
                100, 
                "bg-orange-500", 
                "饱食"
            )}
            {renderBar(
                <Zap className="w-3 h-3 text-yellow-500" />, 
                playerState.energy, 
                100, 
                "bg-yellow-500", 
                "精力"
            )}
            {renderBar(
                <Smile className="w-3 h-3 text-purple-400" />, 
                playerState.comfort, 
                100, 
                "bg-purple-500", 
                "舒适"
            )}
          </div>

          <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-slate-700">
             <Thermometer className={clsx("w-4 h-4", 
                 playerState.currentTemperature < 10 ? "text-blue-400" : 
                 playerState.currentTemperature > 30 ? "text-red-400" : "text-green-400"
             )} />
             <span className="text-slate-300 font-mono text-sm">{playerState.currentTemperature}°C</span>
          </div>
      </div>
    </div>
  );
};
