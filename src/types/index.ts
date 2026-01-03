// Core TypeScript Type Definitions

// --- Player State Types ---

export interface PlayerState {
  hunger: number;           // 饥饿值 (0-100)
  comfort: number;          // 舒适值 (0-100)
  health: number;           // 健康值 (0-100)
  energy: number;           // 体力值 (0-100)
  inventory: InventoryItem[];
  shelterLevel: number;     // 庇护所等级 (0-3)
  currentSeason: Season;
  currentTemperature: number;
  gameDay: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: ItemType;
  quantity: number;
  description?: string;
  properties?: ItemProperties;
}

export enum ItemType {
  FOOD = 'food',
  MATERIAL = 'material',
  TOOL = 'tool',
  CLOTHING = 'clothing',
  FURNITURE = 'furniture',
  WATER = 'water',
  MEDICINE = 'medicine', // Added medicine type
  FUEL = 'fuel',
  MACHINE = 'machine',
  VEHICLE = 'vehicle'
}

export enum Season {
  SPRING = 'spring',
  SUMMER = 'summer',
  AUTUMN = 'autumn',
  WINTER = 'winter'
}

export interface ItemProperties {
  hungerRestore?: number;
  comfortBonus?: number;
  healthRestore?: number; // Added health restore property
  warmth?: number;
  durability?: number;
  efficiency?: number;
}

// --- Crafting System Types ---

export interface CraftingRecipe {
  id: string;
  name: string;
  result: InventoryItem;
  materials: MaterialRequirement[];
  requiredTools?: string[]; // Item IDs
  craftingTime: number; // In game minutes or actions
  shelterLevelRequired: number;
  description?: string;
}

export interface MaterialRequirement {
  itemId: string;
  quantity: number;
}

export interface CraftingResult {
  success: boolean;
  message: string;
  item?: InventoryItem;
  experienceGained?: number;
}

// --- Exploration System Types ---

export interface ExplorationArea {
  id: string;
  name: string;
  description: string;
  riskLevel: number;      // 1-5，风险等级
  resourcePotential: number; // 1-5，资源潜力
  energyCost: number;     // 消耗体力值
  timeRequired: number;   // 所需时间（小时）
  possibleEvents: ExplorationEvent[];
  resourceList?: string[]; // Added resource list for UI display
}

export interface ExplorationEvent {
  id: string;
  type: EventType;
  probability: number; // 0-1
  description: string;
  enemyId?: string; // If present, triggers combat
  outcomes: EventOutcome[];
}

export enum EventType {
  POSITIVE = 'positive',
  NEGATIVE = 'negative',
  NEUTRAL = 'neutral'
}

export interface EventOutcome {
  type: 'item' | 'status' | 'information';
  value: any; // InventoryItem for item, { stat: string, value: number } for status
  probability: number; // 0-1
  message: string;
}

export interface Enemy {
  id: string;
  name: string;
  maxHp: number;
  attack: number; // Damage per hit
  description: string;
  loot?: {
    itemId: string;
    probability: number;
    quantity: number;
  }[];
}

// --- Shelter System Types ---

export interface Shelter {
  level: number;
  warmthBonus: number;
  maxOccupancy: number;
  facilities: ShelterFacility[];
  upgradeRequirements: UpgradeRequirement[];
}

export interface ShelterFacility {
  id: string;
  name: string;
  type: FacilityType;
  level: number;
  description?: string;
  bonuses: FacilityBonus[];
}

export enum FacilityType {
  BED = 'bed',
  STORAGE = 'storage',
  WORKSHOP = 'workshop',
  KITCHEN = 'kitchen',
  HEATER = 'heater',
  GENERATOR = 'generator'
}

export interface FacilityBonus {
  type: 'comfort' | 'efficiency' | 'capacity';
  value: number;
}

export interface UpgradeRequirement {
  materials: MaterialRequirement[];
  timeRequired: number;
  shelterLevel: number;
}

// --- Game System Types ---

export enum HungerLevel {
  FULL = 'full',
  NORMAL = 'normal',
  HUNGRY = 'hungry',
  STARVING = 'starving'
}

export interface GameEventLog {
  id: string;
  timestamp: number;
  gameDay: number;
  type: 'info' | 'success' | 'warning' | 'danger';
  message: string;
}

// --- Data Persistence Types ---

export interface GameSaveData {
  version: string;
  timestamp: number;
  playerState: PlayerState;
  shelterState: Shelter;
  gameSettings: GameSettings;
  statistics: GameStatistics;
  eventLogs: GameEventLog[];
  isGameOver?: boolean; // Added isGameOver flag
}

export interface GameSettings {
  autoSaveInterval: number;  // 自动保存间隔（分钟）
  difficulty: DifficultyLevel;
  enableSound: boolean;
}

export enum DifficultyLevel {
  EASY = 'easy',
  NORMAL = 'normal',
  HARD = 'hard',
  SURVIVAL = 'survival'
}

export interface GameStatistics {
  totalDaysSurvived: number;
  itemsCrafted: number;
  explorationsCompleted: number;
  shelterUpgrades: number;
  rareItemsFound: number;
}
