import { ExplorationArea, EventType, ItemType } from '../types';

export const explorationAreas: ExplorationArea[] = [
  {
    id: 'ruins_outskirts',
    name: '废墟外围',
    description: '城市边缘的废墟，相对安全，有一些残留的生活物资。',
    riskLevel: 1,
    resourcePotential: 2,
    energyCost: 20,
    timeRequired: 4,
    resourceList: ['canned_food', 'wood', 'herbs', 'raw_meat'], // Added resource list
    possibleEvents: [
      {
        id: 'find_canned_food',
        type: EventType.POSITIVE,
        probability: 0.3,
        description: '你在废弃的房屋里发现了一些罐头。',
        outcomes: [{
          type: 'item',
          value: { id: 'canned_food', name: '罐头', type: ItemType.FOOD, quantity: 2, properties: { hungerRestore: 30 } },
          probability: 1,
          message: '获得了 罐头 x2'
        }]
      },
      {
        id: 'find_wood',
        type: EventType.POSITIVE,
        probability: 0.3,
        description: '你收集到了一些可用的木材。',
        outcomes: [{
          type: 'item',
          value: { id: 'wood', name: '木材', type: ItemType.MATERIAL, quantity: 5 },
          probability: 1,
          message: '获得了 木材 x5'
        }]
      },
      {
        id: 'encounter_rats',
        type: EventType.NEGATIVE,
        probability: 0.2,
        description: '你惊动了一群变异老鼠！',
        enemyId: 'rat_swarm',
        outcomes: [] // Outcomes handled by combat system
      },
      {
        id: 'find_herbs',
        type: EventType.POSITIVE,
        probability: 0.25,
        description: '你在废墟的缝隙中发现了一些可用的草药。',
        outcomes: [{
          type: 'item',
          value: { id: 'herbs', name: '草药', type: ItemType.MEDICINE, quantity: 2, properties: { healthRestore: 15 } },
          probability: 1,
          message: '获得了 草药 x2'
        }]
      },
      {
        id: 'nothing_found',
        type: EventType.NEUTRAL,
        probability: 0.2,
        description: '你搜索了一圈，什么也没发现。',
        outcomes: []
      }
    ]
  },
  {
    id: 'abandoned_supermarket',
    name: '废弃超市',
    description: '曾经的物资中心，虽然被洗劫过，但可能还有遗漏。',
    riskLevel: 3,
    resourcePotential: 4,
    energyCost: 40,
    timeRequired: 6,
    resourceList: ['water', 'first_aid_kit', 'canned_food', 'scrap_metal'], // Added resource list
    possibleEvents: [
       {
        id: 'find_water',
        type: EventType.POSITIVE,
        probability: 0.3,
        description: '你在仓库角落发现了几瓶水。',
        outcomes: [{
          type: 'item',
          value: { id: 'water', name: '水', type: ItemType.WATER, quantity: 3, properties: { hungerRestore: 10, comfortBonus: 5 } },
          probability: 1,
          message: '获得了 水 x3'
        }]
      },
      {
        id: 'wild_dog_attack',
        type: EventType.NEGATIVE,
        probability: 0.3,
        description: '你遇到了一只饥饿的野狗！',
        enemyId: 'wild_dog',
        outcomes: []
      },
       {
        id: 'find_first_aid_kit',
        type: EventType.POSITIVE,
        probability: 0.15,
        description: '你在货架深处发现了一个完好的急救包。',
        outcomes: [{
          type: 'item',
          value: { id: 'first_aid_kit', name: '急救包', type: ItemType.MEDICINE, quantity: 1, properties: { healthRestore: 50 } },
          probability: 1,
          message: '获得了 急救包 x1'
        }]
      },
       {
        id: 'find_supplies',
        type: EventType.POSITIVE,
        probability: 0.2,
        description: '你找到了一个未被打开的急救箱。',
        outcomes: [{
          type: 'status',
          value: { stat: 'health', value: 20 },
          probability: 1,
          message: '使用了急救箱，恢复了 20点 生命值'
        }]
      },
      {
        id: 'encounter_bandit',
        type: EventType.NEGATIVE,
        probability: 0.2,
        description: '你遇到了一个看起来不怀好意的流浪者。',
        enemyId: 'bandit',
        outcomes: []
      }
    ]
  },
  {
    id: 'industrial_zone',
    name: '工业区',
    description: '充满了危险的机械和废料，是寻找高级材料的好地方。',
    riskLevel: 4,
    resourcePotential: 5,
    energyCost: 60,
    timeRequired: 8,
    resourceList: ['metal', 'stone', 'plastic', 'raw_meat'], // Added resource list
    possibleEvents: [
      {
        id: 'find_metal',
        type: EventType.POSITIVE,
        probability: 0.3,
        description: '你拆卸了一些废弃机器，获得了金属零件。',
        outcomes: [{
          type: 'item',
          value: { id: 'metal', name: '金属', type: ItemType.MATERIAL, quantity: 3 },
          probability: 1,
          message: '获得了 金属 x3'
        }]
      },
      {
        id: 'toxic_gas',
        type: EventType.NEGATIVE,
        probability: 0.2,
        description: '你不小心吸入了泄漏的化学气体。',
        outcomes: [{
          type: 'status',
          value: { stat: 'health', value: -30 },
          probability: 1,
          message: '中毒，失去了 30点 生命值'
        }]
      },
      {
        id: 'find_stone',
        type: EventType.POSITIVE,
        probability: 0.2,
        description: '你收集了一些建筑用的石材。',
        outcomes: [{
          type: 'item',
          value: { id: 'stone', name: '石材', type: ItemType.MATERIAL, quantity: 5 },
          probability: 1,
          message: '获得了 石材 x5'
        }]
      },
      {
        id: 'encounter_bear',
        type: EventType.NEGATIVE,
        probability: 0.3,
        description: '一只巨大的变异熊挡住了你的去路！',
        enemyId: 'bear',
        outcomes: []
      },
      {
        id: 'find_plastic',
        type: EventType.POSITIVE,
        probability: 0.2,
        description: '你发现了一堆废弃的塑料制品。',
        outcomes: [{
          type: 'item',
          value: { id: 'plastic', name: '塑料', type: ItemType.MATERIAL, quantity: 3 },
          probability: 1,
          message: '获得了 塑料 x3'
        }]
      }
    ]
  },
  {
    id: 'deep_sea',
    name: '深海',
    description: '神秘莫测的海底世界，蕴藏着丰富的海洋资源，但也危机四伏。需要潜水服才能进入。',
    riskLevel: 5,
    resourcePotential: 5,
    energyCost: 50,
    timeRequired: 6,
    resourceList: ['coral', 'yellow_croaker', 'shark_meat', 'shark_skin', 'urchin_meat', 'octopus_leg'], // Added resource list
    possibleEvents: [
      {
        id: 'find_coral',
        type: EventType.POSITIVE,
        probability: 0.25,
        description: '你发现了一片美丽的珊瑚礁。',
        outcomes: [{
          type: 'item',
          value: { id: 'coral', name: '珊瑚', type: ItemType.MATERIAL, quantity: 2 },
          probability: 1,
          message: '获得了 珊瑚 x2'
        }]
      },
      {
        id: 'find_yellow_croaker',
        type: EventType.POSITIVE,
        probability: 0.25,
        description: '一群小黄鱼从你身边游过。',
        outcomes: [{
          type: 'item',
          value: { id: 'yellow_croaker', name: '小黄鱼', type: ItemType.FOOD, quantity: 3, properties: { hungerRestore: 15 } },
          probability: 1,
          message: '获得了 小黄鱼 x3'
        }]
      },
      {
        id: 'encounter_urchin',
        type: EventType.NEGATIVE,
        probability: 0.3, // Medium probability
        description: '你不小心踩到了一个剧毒海胆！它吸附在了你身上！',
        enemyId: 'urchin',
        outcomes: []
      },
      {
        id: 'encounter_shark',
        type: EventType.NEGATIVE,
        probability: 0.05, // Very low probability
        description: '巨大的黑影笼罩了你...是一条巨齿鲨！',
        enemyId: 'shark',
        outcomes: []
      },
      {
        id: 'encounter_jellyfish',
        type: EventType.NEGATIVE,
        probability: 0.1,
        description: '美丽但危险的幽灵水母在前方漂浮。',
        enemyId: 'jellyfish',
        outcomes: []
      },
      {
        id: 'encounter_octopus',
        type: EventType.NEGATIVE,
        probability: 0.05,
        description: '一只深海章鱼试图缠住你。',
        enemyId: 'octopus',
        outcomes: []
      }
    ]
  }
];
