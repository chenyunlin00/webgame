import { CraftingRecipe, ItemType } from '../types';

export const recipes: CraftingRecipe[] = [
  {
    id: 'cooked_meat',
    name: '烤肉',
    description: '香喷喷的烤肉，能大幅恢复饥饿值。',
    result: { id: 'cooked_meat', name: '烤肉', type: ItemType.FOOD, quantity: 1, properties: { hungerRestore: 40 } },
    materials: [{ itemId: 'raw_meat', quantity: 1 }, { itemId: 'wood', quantity: 1 }],
    craftingTime: 30,
    shelterLevelRequired: 0
  },
  {
    id: 'simple_clothing',
    name: '简易外套',
    description: '用破布和纤维缝制的外套，提供基础保暖。',
    result: { id: 'simple_clothing', name: '简易外套', type: ItemType.CLOTHING, quantity: 1, properties: { warmth: 10 } },
    materials: [{ itemId: 'cloth', quantity: 3 }, { itemId: 'fiber', quantity: 2 }], // Assuming we have these items
    craftingTime: 60,
    shelterLevelRequired: 0
  },
  {
    id: 'stone_axe',
    name: '石斧',
    description: '基础工具，也许能用来防身。',
    result: { id: 'stone_axe', name: '石斧', type: ItemType.TOOL, quantity: 1 },
    materials: [{ itemId: 'wood', quantity: 2 }, { itemId: 'stone', quantity: 2 }],
    craftingTime: 45,
    shelterLevelRequired: 0
  },
  {
    id: 'bed',
    name: '简易床铺',
    description: '比睡地板舒服多了，增加休息效率。',
    result: { id: 'bed', name: '简易床铺', type: ItemType.FURNITURE, quantity: 1, properties: { comfortBonus: 10 } },
    materials: [{ itemId: 'wood', quantity: 10 }, { itemId: 'cloth', quantity: 5 }],
    craftingTime: 120,
    shelterLevelRequired: 1
  },
  {
    id: 'diving_suit',
    name: '潜水服',
    description: '使用特殊材料制作的潜水装备，可以进入海底探索。',
    result: { id: 'diving_suit', name: '潜水服', type: ItemType.CLOTHING, quantity: 1, properties: { warmth: 5, durability: 100 } },
    materials: [{ itemId: 'cloth', quantity: 5 }, { itemId: 'metal', quantity: 3 }, { itemId: 'plastic', quantity: 2 }], // Need to ensure plastic/metal exists or use existing
    craftingTime: 180,
    shelterLevelRequired: 1
  }
];
