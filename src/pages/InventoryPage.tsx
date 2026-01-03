import React from 'react';
import { useGame } from '../context/GameContext';
import { ItemCard } from '../components/game/ItemCard';
import { InventoryItem, ItemType } from '../types';
import { soundManager } from '../utils/SoundManager';

export const InventoryPage: React.FC = () => {
  const { state, dispatch } = useGame();
  const { inventory, equipment } = state.playerState;

  // Auto-fix broken items on mount
  React.useEffect(() => {
    dispatch({ type: 'FIX_BROKEN_ITEMS' });
  }, [dispatch]);

  const handleUseItem = (item: InventoryItem) => {
    // Play sound based on item type
    if (item.type === ItemType.FOOD) {
      soundManager.playEatSound();
    } else if (item.type === ItemType.WATER) {
      soundManager.playDrinkSound();
    } else if (item.type === ItemType.MEDICINE) {
      soundManager.playHealSound();
    } else if (item.id === 'sos_transmitter') {
        // Trigger win
        dispatch({ type: 'WIN_GAME', payload: { type: 'sos' } });
        return;
    }

    dispatch({ type: 'EAT', payload: { itemId: item.id } });
  };

  const handleEquip = (item: InventoryItem) => {
    dispatch({ type: 'EQUIP_ITEM', payload: { itemId: item.id } });
  };

  const handleUnequip = (item: InventoryItem) => {
      const slot = item.type === ItemType.TOOL ? 'weapon' : 'armor';
      dispatch({ type: 'UNEQUIP_ITEM', payload: { slot } });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">装备与背包</h1>

      {/* Equipment Slots */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-300 mb-4">当前装备</h2>
        <div className="grid grid-cols-2 gap-4">
            {/* Weapon Slot */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <h3 className="text-sm font-bold text-slate-500 mb-2 uppercase">主武器</h3>
                {equipment.weapon ? (
                    <ItemCard 
                        item={equipment.weapon} 
                        isEquipped={true}
                        onUnequip={handleUnequip}
                    />
                ) : (
                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-700 rounded-lg text-slate-600">
                        未装备武器
                    </div>
                )}
            </div>

            {/* Armor Slot */}
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                <h3 className="text-sm font-bold text-slate-500 mb-2 uppercase">身体护甲</h3>
                {equipment.armor ? (
                    <ItemCard 
                        item={equipment.armor} 
                        isEquipped={true}
                        onUnequip={handleUnequip}
                    />
                ) : (
                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-700 rounded-lg text-slate-600">
                        未装备护甲
                    </div>
                )}
            </div>
        </div>
      </div>
      
      <h2 className="text-xl font-bold text-slate-300 mb-4">物品栏</h2>
      {inventory.length === 0 ? (
        <div className="bg-slate-800 p-8 rounded-xl text-center border border-slate-700">
          <p className="text-slate-400 text-lg">背包空空如也...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {inventory.map((item) => (
            <ItemCard 
                key={item.id} 
                item={item} 
                onUse={handleUseItem} 
                onEquip={handleEquip}
            />
          ))}
        </div>
      )}
    </div>
  );
};
