import React from 'react';
import { Bed, Map, Hammer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';

export const ActionButtons: React.FC = () => {
  const navigate = useNavigate();
  const { dispatch } = useGame();

  const handleRest = () => {
    dispatch({ type: 'REST' });
    dispatch({ type: 'TICK' }); // Resting advances time
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      <button
        onClick={() => navigate('/explore')}
        className="flex flex-col items-center justify-center p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all hover:border-orange-500 group"
      >
        <Map className="w-8 h-8 text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
        <span className="font-semibold text-slate-200">外出探索</span>
      </button>

      <button
        onClick={() => navigate('/crafting')}
        className="flex flex-col items-center justify-center p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all hover:border-orange-500 group"
      >
        <Hammer className="w-8 h-8 text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
        <span className="font-semibold text-slate-200">制作物品</span>
      </button>

      <button
        onClick={handleRest}
        className="flex flex-col items-center justify-center p-6 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all hover:border-orange-500 group"
      >
        <Bed className="w-8 h-8 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
        <span className="font-semibold text-slate-200">休息恢复</span>
      </button>

      {/* Placeholder for another action or dynamic */}
      <div className="flex flex-col items-center justify-center p-6 bg-slate-800/50 border border-slate-800 rounded-xl text-slate-500">
        <span className="text-sm">更多行动...</span>
      </div>
    </div>
  );
};
