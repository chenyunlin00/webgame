import React from 'react';
import { InventoryItem, ItemType } from '../../types';
import { Package, Utensils, Hammer, Shirt, Droplet, Flame, Truck, Box, Heart, Smile } from 'lucide-react';
import clsx from 'clsx';

interface ItemCardProps {
  item: InventoryItem;
  onUse?: (item: InventoryItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onUse }) => {
  const getIcon = (type: ItemType) => {
    switch (type) {
      case ItemType.FOOD: return Utensils;
      case ItemType.TOOL: return Hammer;
      case ItemType.CLOTHING: return Shirt;
      case ItemType.WATER: return Droplet;
      case ItemType.FUEL: return Flame;
      case ItemType.VEHICLE: return Truck;
      case ItemType.MATERIAL: return Box;
      case ItemType.MEDICINE: return Heart;
      default: return Package;
    }
  };

  const Icon = getIcon(item.type);

  return (
    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 flex flex-col justify-between hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="bg-slate-700 p-2 rounded-lg">
          <Icon className={clsx("w-6 h-6", {
              "text-orange-400": item.type === ItemType.FOOD,
              "text-blue-400": item.type === ItemType.WATER,
              "text-red-400": item.type === ItemType.MEDICINE,
              "text-slate-300": ![ItemType.FOOD, ItemType.WATER, ItemType.MEDICINE].includes(item.type)
          })} />
        </div>
        <span className="bg-slate-700 text-xs px-2 py-1 rounded text-slate-300">
          x{item.quantity}
        </span>
      </div>
      <div>
        <h4 className="font-semibold text-slate-200">{item.name}</h4>
        <p className="text-xs text-slate-500 mt-1 capitalize">{
            item.type === 'food' ? '食物' :
            item.type === 'water' ? '饮品' :
            item.type === 'medicine' ? '药品' :
            item.type === 'material' ? '材料' :
            item.type === 'tool' ? '工具' :
            item.type === 'clothing' ? '装备' : item.type
        }</p>
        
        {item.properties && (
           <div className="mt-3 grid grid-cols-2 gap-1 text-xs">
               {item.properties.healthRestore && (
                   <div className="flex items-center text-red-400" title="恢复生命值">
                       <Heart className="w-3 h-3 mr-1" />
                       +{item.properties.healthRestore}
                   </div>
               )}
               {item.properties.hungerRestore && (
                   <div className="flex items-center text-orange-400" title="恢复饱食度">
                       <Utensils className="w-3 h-3 mr-1" />
                       +{item.properties.hungerRestore}
                   </div>
               )}
               {item.properties.comfortBonus && (
                   <div className="flex items-center text-yellow-400" title="增加舒适度">
                       <Smile className="w-3 h-3 mr-1" />
                       +{item.properties.comfortBonus}
                   </div>
               )}
               {item.properties.warmth && (
                   <div className="flex items-center text-orange-300" title="提供保暖">
                       <Flame className="w-3 h-3 mr-1" />
                       +{item.properties.warmth}
                   </div>
               )}
           </div>
        )}
      </div>
      {onUse && (item.type === ItemType.FOOD || item.type === ItemType.WATER || item.type === ItemType.MEDICINE) && (
        <button
          onClick={() => onUse(item)}
          className="mt-3 w-full bg-slate-700 hover:bg-emerald-600 text-slate-200 text-sm py-1.5 rounded transition-colors flex items-center justify-center gap-1"
        >
          使用
        </button>
      )}
    </div>
  );
};
