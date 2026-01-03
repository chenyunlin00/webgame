import React from 'react';
import { useGame } from '../../context/GameContext';
import { Trophy, LogOut, Anchor, Radio } from 'lucide-react';

export const VictoryModal: React.FC = () => {
  const { state, dispatch } = useGame();

  if (!state.gameWon) return null;

  const handleRestart = () => {
    if (window.confirm('确定要重新开始游戏吗？当前的存档将会丢失。')) {
      dispatch({ type: 'RESET_GAME' });
      window.location.reload();
    }
  };

  const isDeepSeaEnding = state.victoryType === 'deep_sea';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className={`bg-slate-800 border-2 rounded-2xl max-w-lg w-full p-8 shadow-2xl relative overflow-hidden ${isDeepSeaEnding ? 'border-cyan-500/50' : 'border-yellow-500/50'}`}>
        {/* Background Effects */}
        <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r animate-pulse ${isDeepSeaEnding ? 'from-cyan-600 via-cyan-400 to-cyan-600' : 'from-yellow-600 via-yellow-400 to-yellow-600'}`} />
        <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl ${isDeepSeaEnding ? 'bg-cyan-500/20' : 'bg-yellow-500/20'}`} />
        
        <div className="flex flex-col items-center text-center">
          <div className={`p-6 rounded-full mb-6 ring-4 animate-bounce ${isDeepSeaEnding ? 'bg-cyan-500/20 ring-cyan-500/30' : 'bg-yellow-500/20 ring-yellow-500/30'}`}>
            {isDeepSeaEnding ? (
                <Anchor className="w-16 h-16 text-cyan-400" />
            ) : (
                <Trophy className="w-16 h-16 text-yellow-400" />
            )}
          </div>
          
          <h2 className="text-4xl font-bold text-white mb-2 tracking-wide">
            {isDeepSeaEnding ? '发现新世界！' : '救援成功！'}
          </h2>
          <p className={`font-medium text-lg mb-6 ${isDeepSeaEnding ? 'text-cyan-400' : 'text-yellow-400'}`}>
            {isDeepSeaEnding ? '通过深海隧道，你抵达了一个未被污染的地下城。' : 'SOS 信号已发出，救援队正在赶来。'}
          </p>
          
          <div className="bg-slate-900/50 rounded-xl p-6 w-full mb-8 border border-slate-700">
            <h3 className="text-slate-400 text-sm uppercase font-bold mb-4">生存统计</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              <div className="text-left">
                <span className="block text-slate-500 text-xs uppercase">生存天数</span>
                <span className="text-2xl font-mono text-white">{state.playerState.gameDay} 天</span>
              </div>
              <div className="text-left">
                <span className="block text-slate-500 text-xs uppercase">制作物品</span>
                <span className="text-2xl font-mono text-emerald-400">{state.statistics.itemsCrafted}</span>
              </div>
              <div className="text-left">
                <span className="block text-slate-500 text-xs uppercase">探索次数</span>
                <span className="text-2xl font-mono text-blue-400">{state.statistics.explorationsCompleted}</span>
              </div>
              <div className="text-left">
                <span className="block text-slate-500 text-xs uppercase">庇护所等级</span>
                <span className="text-2xl font-mono text-orange-400">Lv.{state.playerState.shelterLevel}</span>
              </div>
            </div>
          </div>

          <p className="text-slate-400 mb-8 leading-relaxed">
            {isDeepSeaEnding 
                ? '在那条幽暗的隧道尽头，你看到了久违的光芒。这不是结束，而是人类新文明的开始。'
                : '经过漫长的生存与抗争，你终于在这个荒废的世界中建立起了联络。直升机的轰鸣声由远及近，那是希望的声音...'}
          </p>

          <button 
            onClick={handleRestart}
            className={`group relative px-8 py-3 text-white font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2 ${
                isDeepSeaEnding 
                ? 'bg-cyan-600 hover:bg-cyan-500 hover:shadow-cyan-500/25' 
                : 'bg-yellow-600 hover:bg-yellow-500 hover:shadow-yellow-500/25'
            }`}
          >
            <LogOut className="w-5 h-5" />
            开启新的旅程
          </button>
        </div>
      </div>
    </div>
  );
};
