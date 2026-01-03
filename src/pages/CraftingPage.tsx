import React from 'react';
import { useGame } from '../context/GameContext';
import { recipes } from '../data/recipes';
import { Hammer, Clock, Home } from 'lucide-react';
import clsx from 'clsx';

export const CraftingPage: React.FC = () => {
  const { state, dispatch } = useGame();
  const { playerState } = state;

  const canCraft = (recipe: typeof recipes[0]) => {
    // Check shelter level
    if (playerState.shelterLevel < recipe.shelterLevelRequired) return false;

    // Check materials
    return recipe.materials.every(req => {
      const item = playerState.inventory.find(i => i.id === req.itemId);
      return item && item.quantity >= req.quantity;
    });
  };

  const handleCraft = (recipe: typeof recipes[0]) => {
    if (!canCraft(recipe)) return;

    // Deduct materials
    recipe.materials.forEach(req => {
      dispatch({ type: 'REMOVE_ITEM', payload: { itemId: req.itemId, quantity: req.quantity } });
    });

    // Add result
    dispatch({ type: 'ADD_ITEM', payload: { item: recipe.result } });

    // Advance time? (Simplified: crafting doesn't consume time in this version to avoid complex UI feedback, 
    // or we can dispatch TICK manually if we want)
    // dispatch({ type: 'TICK' }); 

    // Log event
    dispatch({ 
        type: 'LOG_EVENT', 
        payload: { 
            message: `制作了 ${recipe.name}`, 
            type: 'success' 
        } 
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">制作合成</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {recipes.map(recipe => {
          const isCraftable = canCraft(recipe);
          const shelterRequirementMet = playerState.shelterLevel >= recipe.shelterLevelRequired;

          return (
            <div key={recipe.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-slate-100">{recipe.name}</h3>
                    <p className="text-sm text-slate-400 mt-1">{recipe.description}</p>
                </div>
                {recipe.shelterLevelRequired > 0 && (
                    <div className={clsx("flex items-center text-xs px-2 py-1 rounded", shelterRequirementMet ? "bg-slate-700 text-slate-300" : "bg-red-900/30 text-red-400")}>
                        <Home className="w-3 h-3 mr-1" />
                        <span>Lv.{recipe.shelterLevelRequired}</span>
                    </div>
                )}
              </div>

              <div className="space-y-2 mb-6">
                <p className="text-xs text-slate-500 font-semibold uppercase">所需材料:</p>
                {recipe.materials.map((req, idx) => {
                  const item = playerState.inventory.find(i => i.id === req.itemId);
                  const currentQty = item ? item.quantity : 0;
                  const hasEnough = currentQty >= req.quantity;

                  // We need to map itemId to name for display. 
                  // Since we don't have a global item DB, we rely on hardcoded names or finding them.
                  // For now, I'll use the ID or try to find a name if I have it in inventory, otherwise use ID as fallback.
                  // Ideally recipes should have material names or we look up in a dictionary.
                  // I'll add a helper map or just use ID for now, or assume recipe defines display name?
                  // The type definition says MaterialRequirement only has itemId.
                  // I will update recipes.ts to include material names or hardcode a map here.
                  // Hack: Map common IDs to names.
                  const nameMap: Record<string, string> = {
                      'wood': '木材',
                      'stone': '石材',
                      'metal': '金属',
                      'cloth': '布料',
                      'fiber': '纤维',
                      'meat': '生肉',
                      'raw_meat': '生肉', // Add mapping for raw_meat
                      'plastic': '塑料',
                  };
                  const itemName = nameMap[req.itemId] || req.itemId;

                  return (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-slate-300">{itemName}</span>
                      <span className={hasEnough ? 'text-green-400' : 'text-red-400'}>
                        {currentQty}/{req.quantity}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => handleCraft(recipe)}
                disabled={!isCraftable}
                className={clsx(
                  "w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center",
                  isCraftable
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/20"
                    : "bg-slate-700 text-slate-500 cursor-not-allowed"
                )}
              >
                <Hammer className="w-4 h-4 mr-2" />
                制作
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
