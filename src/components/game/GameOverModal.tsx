import React from 'react';
import { Skull, RotateCcw } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { SaveManager } from '../../utils/saveManager';

export const GameOverModal: React.FC = () => {
  const { state, dispatch } = useGame();

  if (!state.isGameOver) return null;

  const handleRestart = async () => {
    await SaveManager.clearSave();
    dispatch({ type: 'RESET_GAME' });
    // Optionally reload page to ensure clean slate, but reducer reset should work
    window.location.reload(); 
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-2 border-red-900/50 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl shadow-red-900/20">
        <div className="mb-6 flex justify-center">
          <div className="bg-red-900/20 p-4 rounded-full">
            <Skull className="w-16 h-16 text-red-500 animate-pulse" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-red-500 mb-2">游戏结束</h2>
        <p className="text-slate-400 mb-8">
          你在末日世界中生存了 <span className="text-white font-bold">{state.statistics.totalDaysSurvived}</span> 天。
          <br />
          但最终还是倒下了...
        </p>

        <div className="space-y-4">
          <button
            onClick={handleRestart}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold flex items-center justify-center transition-all transform hover:scale-105"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            重新开始
          </button>
        </div>
      </div>
    </div>
  );
};
