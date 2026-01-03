import { GameSaveData, Season, ItemType, GameEventLog } from '../types';
import { HungerSystem, ComfortCalculator } from '../utils/gameLogic';
import { SaveManager } from '../utils/saveManager';

export type GameAction =
  | { type: 'TICK' }
  | { type: 'EAT'; payload: { itemId: string } }
  | { type: 'REST' }
  | { type: 'CRAFT'; payload: { recipeId: string } } // Simplified for now
  | { type: 'BUILD_SHELTER' }
  | { type: 'ADD_ITEM'; payload: { item: any } } // Using any for simplicity in rapid dev, strictly InventoryItem
  | { type: 'REMOVE_ITEM'; payload: { itemId: string; quantity: number } }
  | { type: 'UPDATE_STATS'; payload: { stat: 'health' | 'hunger' | 'comfort' | 'energy'; value: number } }
  | { type: 'LOG_EVENT'; payload: { message: string; type: 'info' | 'success' | 'warning' | 'danger' } }
  | { type: 'LOAD_GAME'; payload: GameSaveData }
  | { type: 'RESET_GAME' };

export const initialState: GameSaveData = {
  version: '1.0.0',
  timestamp: Date.now(),
  playerState: {
    hunger: 80,
    comfort: 80,
    health: 100,
    energy: 100,
    inventory: [],
    shelterLevel: 0,
    currentSeason: Season.SPRING,
    currentTemperature: 20,
    gameDay: 1,
  },
  shelterState: {
    level: 0,
    warmthBonus: 0,
    maxOccupancy: 1,
    facilities: [],
    upgradeRequirements: [],
  },
  gameSettings: {
    autoSaveInterval: 5,
    difficulty: 'normal' as any,
    enableSound: true,
  },
  statistics: {
    totalDaysSurvived: 0,
    itemsCrafted: 0,
    explorationsCompleted: 0,
    shelterUpgrades: 0,
    rareItemsFound: 0,
  },
  eventLogs: [],
};

export const gameReducer = (state: GameSaveData, action: GameAction): GameSaveData => {
  switch (action.type) {
    case 'TICK': {
      // 1. Advance Day
      const newDay = state.playerState.gameDay + 1;
      
      // 2. Update Season & Temperature (Simplified cycle)
      // Cycle: Spring (1-10), Summer (11-20), Autumn (21-30), Winter (31-40) -> Repeat
      const cycleDay = (newDay - 1) % 40;
      let newSeason = Season.SPRING;
      let baseTemp = 20;

      if (cycleDay < 10) {
        newSeason = Season.SPRING;
        baseTemp = 20;
      } else if (cycleDay < 20) {
        newSeason = Season.SUMMER;
        baseTemp = 30;
      } else if (cycleDay < 30) {
        newSeason = Season.AUTUMN;
        baseTemp = 10;
      } else {
        newSeason = Season.WINTER;
        baseTemp = -5;
      }
      
      // Random fluctuation
      const newTemp = baseTemp + Math.floor(Math.random() * 5) - 2;

      // 3. Update Hunger
      const newHunger = HungerSystem.calculateHungerDecay(state.playerState.hunger, newDay);
      
      // 4. Update Comfort
      const newComfort = ComfortCalculator.calculateComfort(
        100, // Base comfort
        state.playerState.inventory,
        state.playerState.shelterLevel,
        newTemp,
        newSeason
      );

      // 5. Health Check
      let newHealth = state.playerState.health;
      if (newHunger <= 0) newHealth -= 10;
      if (newComfort <= 0) newHealth -= 5;
      
      const isDead = newHealth <= 0;

      // Log critical events
      const newLogs = [...state.eventLogs];
      if (isDead) newLogs.unshift(createLog('你已经死亡！', 'danger', newDay));
      else if (newHunger <= 20) newLogs.unshift(createLog('你感到非常饥饿！', 'warning', newDay));
      else if (newComfort <= 20) newLogs.unshift(createLog('你感到非常寒冷/不适！', 'warning', newDay));

      return {
        ...state,
        isGameOver: isDead, // Update game over status
        timestamp: Date.now(),
        playerState: {
          ...state.playerState,
          gameDay: newDay,
          currentSeason: newSeason,
          currentTemperature: newTemp,
          hunger: newHunger,
          comfort: newComfort,
          health: Math.max(0, newHealth),
        },
        eventLogs: newLogs.slice(0, 50), // Keep last 50
        statistics: {
          ...state.statistics,
          totalDaysSurvived: state.statistics.totalDaysSurvived + 1,
        }
      };
    }

    case 'EAT': {
        const item = state.playerState.inventory.find(i => i.id === action.payload.itemId);
        if (!item || item.quantity <= 0) return state;

        const hungerRestore = item.properties?.hungerRestore || 0;
        const comfortBonus = item.properties?.comfortBonus || 0;
        const healthRestore = item.properties?.healthRestore || 0;

        // Remove 1 item
        const newInventory = state.playerState.inventory.map(i => 
            i.id === action.payload.itemId ? { ...i, quantity: i.quantity - 1 } : i
        ).filter(i => i.quantity > 0);

        return {
            ...state,
            playerState: {
                ...state.playerState,
                hunger: Math.min(100, state.playerState.hunger + hungerRestore),
                comfort: Math.min(100, state.playerState.comfort + comfortBonus),
                health: Math.min(100, state.playerState.health + healthRestore),
                inventory: newInventory
            },
            eventLogs: [createLog(`使用了 ${item.name}`, 'success', state.playerState.gameDay), ...state.eventLogs]
        };
    }

    case 'REST': {
        return {
            ...state,
            playerState: {
                ...state.playerState,
                energy: Math.min(100, state.playerState.energy + 50),
                health: Math.min(100, state.playerState.health + 5)
            },
            eventLogs: [createLog('休息了一会儿，体力恢复了。', 'info', state.playerState.gameDay), ...state.eventLogs]
        };
    }

    case 'ADD_ITEM': {
        const newItem = action.payload.item;
        const existingItemIndex = state.playerState.inventory.findIndex(i => i.id === newItem.id);
        let newInventory = [...state.playerState.inventory];

        if (existingItemIndex >= 0) {
            newInventory[existingItemIndex].quantity += newItem.quantity;
        } else {
            newInventory.push(newItem);
        }

        return {
            ...state,
            playerState: {
                ...state.playerState,
                inventory: newInventory
            },
            eventLogs: [createLog(`获得了 ${newItem.name} x${newItem.quantity}`, 'success', state.playerState.gameDay), ...state.eventLogs]
        };
    }
    
    case 'REMOVE_ITEM': {
        const { itemId, quantity } = action.payload;
        const newInventory = state.playerState.inventory.map(i => {
            if (i.id === itemId) {
                return { ...i, quantity: i.quantity - quantity };
            }
            return i;
        }).filter(i => i.quantity > 0);
        
        return {
            ...state,
            playerState: {
                ...state.playerState,
                inventory: newInventory
            }
        };
    }

    case 'UPDATE_STATS': {
        const { stat, value } = action.payload;
        const currentVal = state.playerState[stat];
        const newVal = Math.max(0, Math.min(100, currentVal + value));
        
        const isDead = stat === 'health' && newVal <= 0;

        return {
            ...state,
            isGameOver: isDead || state.isGameOver,
            playerState: {
                ...state.playerState,
                [stat]: newVal
            }
        };
    }

    case 'BUILD_SHELTER': {
        // Assume checks are done before dispatching
        return {
            ...state,
            playerState: {
                ...state.playerState,
                shelterLevel: state.playerState.shelterLevel + 1
            },
            shelterState: {
                ...state.shelterState,
                level: state.shelterState.level + 1
            },
            statistics: {
                ...state.statistics,
                shelterUpgrades: state.statistics.shelterUpgrades + 1
            },
            eventLogs: [createLog('庇护所升级了！', 'success', state.playerState.gameDay), ...state.eventLogs]
        };
    }
    
    case 'LOG_EVENT': {
        return {
            ...state,
            eventLogs: [createLog(action.payload.message, action.payload.type, state.playerState.gameDay), ...state.eventLogs]
        };
    }

    case 'LOAD_GAME': {
        return action.payload;
    }

    case 'RESET_GAME': {
        return initialState;
    }

    default:
      return state;
  }
};

function createLog(message: string, type: 'info' | 'success' | 'warning' | 'danger', day: number): GameEventLog {
    return {
        id: Date.now().toString() + Math.random(),
        timestamp: Date.now(),
        gameDay: day,
        type,
        message
    };
}
