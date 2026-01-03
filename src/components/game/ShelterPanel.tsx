import React from 'react';
import { useGame } from '../../context/GameContext';
import { Home, Shield, Thermometer, Users } from 'lucide-react';

export const ShelterPanel: React.FC = () => {
  const { state, dispatch } = useGame();
  const { shelterState, playerState } = state;

  const getNextLevelRequirements = (currentLevel: number) => {
    // Simplified requirements for demo
    // Level 0 -> 1: 5 Wood, 2 Stone
    // Level 1 -> 2: 10 Wood, 5 Stone, 2 Metal
    // Level 2 -> 3: 20 Wood, 10 Stone, 5 Metal, 2 Glass
    switch (currentLevel) {
      case 0:
        return { materials: [{ name: '木材', id: 'wood', quantity: 5 }, { name: '石材', id: 'stone', quantity: 2 }] };
      case 1:
        return { materials: [{ name: '木材', id: 'wood', quantity: 10 }, { name: '石材', id: 'stone', quantity: 5 }, { name: '金属', id: 'metal', quantity: 2 }] };
      case 2:
        return { materials: [{ name: '木材', id: 'wood', quantity: 20 }, { name: '石材', id: 'stone', quantity: 10 }, { name: '金属', id: 'metal', quantity: 5 }] };
      default:
        return null; // Max level
    }
  };

  const requirements = getNextLevelRequirements(shelterState.level);

  const canUpgrade = () => {
    if (!requirements) return false;
    return requirements.materials.every(req => {
      const item = playerState.inventory.find(i => i.id === req.id);
      return item && item.quantity >= req.quantity;
    });
  };

  const handleUpgrade = () => {
    if (canUpgrade()) {
        // Deduct materials
        requirements?.materials.forEach(req => {
            dispatch({ type: 'REMOVE_ITEM', payload: { itemId: req.id, quantity: req.quantity } });
        });
        dispatch({ type: 'BUILD_SHELTER' });
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-700">
      <div className="flex items-center mb-6">
        <div className="bg-orange-500 p-3 rounded-full mr-4">
          <Home className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">庇护所等级 {shelterState.level}</h2>
          <p className="text-slate-400">你的安全港湾</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-700 p-4 rounded-lg flex items-center">
          <Thermometer className="w-6 h-6 text-blue-400 mr-3" />
          <div>
            <p className="text-xs text-slate-400">保暖加成</p>
            <p className="text-xl font-bold text-white">+{shelterState.warmthBonus}</p>
          </div>
        </div>
        <div className="bg-slate-700 p-4 rounded-lg flex items-center">
          <Users className="w-6 h-6 text-green-400 mr-3" />
          <div>
            <p className="text-xs text-slate-400">最大容纳</p>
            <p className="text-xl font-bold text-white">{shelterState.maxOccupancy} 人</p>
          </div>
        </div>
        <div className="bg-slate-700 p-4 rounded-lg flex items-center">
          <Shield className="w-6 h-6 text-yellow-400 mr-3" />
          <div>
            <p className="text-xs text-slate-400">防御等级</p>
            <p className="text-xl font-bold text-white">{shelterState.level}</p>
          </div>
        </div>
      </div>

      {requirements ? (
        <div className="border-t border-slate-700 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">升级需求</h3>
          <div className="flex flex-wrap gap-4 mb-6">
            {requirements.materials.map((req, idx) => {
               const item = playerState.inventory.find(i => i.id === req.id);
               const currentQty = item ? item.quantity : 0;
               const isEnough = currentQty >= req.quantity;
               
               return (
                 <div key={idx} className={`px-4 py-2 rounded-lg border ${isEnough ? 'bg-slate-700 border-slate-600' : 'bg-red-900/20 border-red-800'}`}>
                   <span className="text-slate-300">{req.name}: </span>
                   <span className={isEnough ? 'text-green-400' : 'text-red-400'}>
                     {currentQty}/{req.quantity}
                   </span>
                 </div>
               );
            })}
          </div>
          <button
            onClick={handleUpgrade}
            disabled={!canUpgrade()}
            className={`w-full py-3 rounded-lg font-bold transition-all ${
              canUpgrade()
                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-orange-500/20'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            升级庇护所
          </button>
        </div>
      ) : (
        <div className="border-t border-slate-700 pt-6 text-center">
          <p className="text-green-400 font-bold text-lg">庇护所已达到最高等级</p>
        </div>
      )}
    </div>
  );
};
