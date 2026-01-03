import React from 'react';
import { useGame } from '../context/GameContext';
import { ItemCard } from '../components/game/ItemCard';
import { InventoryItem } from '../types';

export const InventoryPage: React.FC = () => {
  const { state, dispatch } = useGame();
  const { inventory } = state.playerState;

  const handleUseItem = (item: InventoryItem) => {
    dispatch({ type: 'EAT', payload: { itemId: item.id } });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">背包物品</h1>
      
      {inventory.length === 0 ? (
        <div className="bg-slate-800 p-8 rounded-xl text-center border border-slate-700">
          <p className="text-slate-400 text-lg">背包空空如也...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {inventory.map((item) => (
            <ItemCard key={item.id} item={item} onUse={handleUseItem} />
          ))}
        </div>
      )}
    </div>
  );
};
