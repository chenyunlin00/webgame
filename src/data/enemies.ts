import { Enemy } from '../types';

export const enemies: Record<string, Enemy> = {
  'wild_dog': {
    id: 'wild_dog',
    name: '野狗',
    maxHp: 50,
    attack: 5,
    description: '一只饥饿的野狗，眼神凶狠。',
    loot: [
      { itemId: 'raw_meat', probability: 0.7, quantity: 2 },
      { itemId: 'cloth', probability: 0.4, quantity: 1 } // 破损的皮毛
    ]
  },
  'wolf': {
    id: 'wolf',
    name: '灰狼',
    maxHp: 80,
    attack: 15,
    description: '孤独的猎手，动作敏捷。',
    loot: [
      { itemId: 'raw_meat', probability: 1, quantity: 2 },
      { itemId: 'cloth', probability: 0.3, quantity: 1 } // 皮毛
    ]
  },
  'bear': {
    id: 'bear',
    name: '变异熊',
    maxHp: 150, // Reduced from 200
    attack: 20, // Reduced from 25
    description: '体型巨大的熊，似乎受到过辐射影响。',
    loot: [
      { itemId: 'raw_meat', probability: 1, quantity: 15 }, // Adjusted quantity to be more reasonable
      { itemId: 'cloth', probability: 0.8, quantity: 5 } // Adjusted quantity
    ]
  },
  'rat_swarm': {
    id: 'rat_swarm',
    name: '鼠群',
    maxHp: 30,
    attack: 5,
    description: '成群结队的老鼠，非常烦人。',
    loot: [
      { itemId: 'raw_meat', probability: 0.8, quantity: 1 },
      { itemId: 'cloth', probability: 0.8, quantity: 5 }, // 破布
      { itemId: 'herbs', probability: 0.1, quantity: 1 }  // 偶尔携带草药
    ]
  },
  'bandit': {
    id: 'bandit',
    name: '流浪强盗',
    maxHp: 100,
    attack: 12,
    description: '手持简易武器的幸存者，不怀好意。',
    loot: [
      { itemId: 'canned_food', probability: 0.5, quantity: 1 },
      { itemId: 'water_bottle', probability: 0.5, quantity: 1 },
      { itemId: 'scrap_metal', probability: 0.3, quantity: 2 }
    ]
  },
  'mutant_rat': {
    id: 'mutant_rat',
    name: '变异巨鼠',
    maxHp: 60,
    attack: 10,
    description: '体型硕大的变异老鼠，牙齿锋利，常在废墟中出没。',
    loot: [
      { itemId: 'raw_meat', probability: 0.6, quantity: 2 },
      { itemId: 'cloth', probability: 0.2, quantity: 1 }
    ]
  },
  'scavenger_drone': {
    id: 'scavenger_drone',
    name: '拾荒无人机',
    maxHp: 80,
    attack: 8,
    description: '失控的自动无人机，会攻击靠近的生物。',
    loot: [
      { itemId: 'scrap_metal', probability: 0.8, quantity: 2 },
      { itemId: 'plastic', probability: 0.5, quantity: 2 },
      { itemId: 'electronic_parts', probability: 0.3, quantity: 1 } // Added electronic parts
    ]
  },
  'shark': {
    id: 'shark',
    name: '巨齿鲨',
    maxHp: 500,
    attack: 40,
    description: '深海的霸主，牙齿像匕首一样锋利。',
    loot: [
      { itemId: 'shark_meat', probability: 1, quantity: 5 },
      { itemId: 'shark_skin', probability: 1, quantity: 2 }
    ]
  },
  'urchin': {
    id: 'urchin',
    name: '剧毒海胆',
    maxHp: 3,
    attack: 0, // Special bleed effect handled in logic
    description: '布满尖刺的黑色圆球，看起来很危险。',
    loot: [
      { itemId: 'urchin_meat', probability: 1, quantity: 1 }
    ]
  },
  'jellyfish': {
    id: 'jellyfish',
    name: '幽灵水母',
    maxHp: 20,
    attack: 10,
    description: '半透明的身体在水中漂浮，触须带有麻痹毒素。',
    loot: [
      { itemId: 'jellyfish_tentacle', probability: 0.5, quantity: 1 }
    ]
  },
  'octopus': {
    id: 'octopus',
    name: '深海章鱼',
    maxHp: 60,
    attack: 15,
    description: '拥有八条触手的聪明生物，擅长缠绕。',
    loot: [
      { itemId: 'octopus_leg', probability: 1, quantity: 2 }
    ]
  }
};
