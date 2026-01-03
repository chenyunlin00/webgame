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
  | { type: 'RESET_GAME' }
  | { type: 'EQUIP_ITEM'; payload: { itemId: string } }
  | { type: 'UNEQUIP_ITEM'; payload: { slot: 'weapon' | 'armor' } }
  | { type: 'WIN_GAME'; payload: { type: 'sos' | 'deep_sea' } }
  | { type: 'FIX_BROKEN_ITEMS' };

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
    equipment: { weapon: null, armor: null } // Initial equipment
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

      // 6. Periodic Supply (Every 3 days)
      let currentInventory = state.playerState.inventory;
      const supplyDayInterval = 3;
      
      if (newDay % supplyDayInterval === 0) {
          const supplyItem = { id: 'canned_food', name: '罐头', type: ItemType.FOOD, quantity: 2, properties: { hungerRestore: 30 } };
          const existingIndex = currentInventory.findIndex(i => i.id === supplyItem.id);
          
          if (existingIndex >= 0) {
              currentInventory = currentInventory.map((item, idx) => 
                  idx === existingIndex ? { ...item, quantity: item.quantity + supplyItem.quantity } : item
              );
          } else {
              currentInventory = [...currentInventory, supplyItem];
          }
          
          // Add log
          newLogs.unshift(createLog('幸运日！你发现了定期投放的空投补给：罐头 x2', 'success', newDay));
      }

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
          inventory: currentInventory
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
            // IMMUTABLE UPDATE: Create a new object for the updated item
            const existingItem = newInventory[existingItemIndex];
            newInventory[existingItemIndex] = {
                ...existingItem,
                ...newItem, // Overwrite with new definition (type, properties, name) to fix broken items
                quantity: existingItem.quantity + newItem.quantity
            };
        } else {
            // CRITICAL: Clone newItem so we don't store a reference to the static data (which would cause mutation of game data)
            newInventory.push({ ...newItem });
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

    case 'EQUIP_ITEM': {
        const itemToEquip = state.playerState.inventory.find(i => i.id === action.payload.itemId);
        if (!itemToEquip) return state;

        const slot = itemToEquip.type === ItemType.TOOL ? 'weapon' : 
                     (itemToEquip.type === ItemType.CLOTHING ? 'armor' : null);
        
        if (!slot) return state; // Can't equip this type

        // 1. Remove from inventory (1 count)
        const newInventory = state.playerState.inventory.map(i => 
             i.id === itemToEquip.id ? { ...i, quantity: i.quantity - 1 } : i
        ).filter(i => i.quantity > 0);

        // 2. Handle existing equipped item
        const currentlyEquipped = state.playerState.equipment[slot];
        if (currentlyEquipped) {
            // Add back to inventory
            const existingIndex = newInventory.findIndex(i => i.id === currentlyEquipped.id);
            if (existingIndex >= 0) {
                newInventory[existingIndex].quantity += 1;
            } else {
                newInventory.push(currentlyEquipped);
            }
        }

        return {
            ...state,
            playerState: {
                ...state.playerState,
                inventory: newInventory,
                equipment: {
                    ...state.playerState.equipment,
                    [slot]: { ...itemToEquip, quantity: 1 } // Equipped item always q=1
                }
            },
            eventLogs: [createLog(`装备了 ${itemToEquip.name}`, 'info', state.playerState.gameDay), ...state.eventLogs]
        };
    }

    case 'UNEQUIP_ITEM': {
        const slot = action.payload.slot;
        const itemToUnequip = state.playerState.equipment[slot];
        
        if (!itemToUnequip) return state;

        // Add back to inventory
        const newInventory = [...state.playerState.inventory];
        const existingIndex = newInventory.findIndex(i => i.id === itemToUnequip.id);
        
        if (existingIndex >= 0) {
            newInventory[existingIndex].quantity += 1;
        } else {
            newInventory.push(itemToUnequip);
        }

        return {
            ...state,
            playerState: {
                ...state.playerState,
                inventory: newInventory,
                equipment: {
                    ...state.playerState.equipment,
                    [slot]: null
                }
            },
            eventLogs: [createLog(`卸下了 ${itemToUnequip.name}`, 'info', state.playerState.gameDay), ...state.eventLogs]
        };
    }

    case 'WIN_GAME': {
        return {
            ...state,
            gameWon: true,
            victoryType: action.payload.type
        };
    }

    case 'FIX_BROKEN_ITEMS': {
        const newInventory = state.playerState.inventory.map(item => {
            if (item.id === 'herbs') {
                return { ...item, type: ItemType.MEDICINE, properties: { healthRestore: 15 } };
            }
            if (item.id === 'first_aid_kit') {
                return { ...item, type: ItemType.MEDICINE, properties: { healthRestore: 50 } };
            }
            if (item.id === 'raw_meat' || item.id === 'yellow_croaker') {
                return { ...item, type: ItemType.FOOD, properties: { hungerRestore: 15 } };
            }
            if (item.id === 'shark_meat') {
                 return { ...item, type: ItemType.FOOD, properties: { hungerRestore: 100, comfortBonus: 50 } };
            }
            if (item.id === 'canned_food') {
                return { ...item, type: ItemType.FOOD, properties: { hungerRestore: 30 } };
            }
            if (item.id === 'water' || item.id === 'water_bottle') {
                return { ...item, type: ItemType.WATER, properties: { hungerRestore: 10, comfortBonus: 5 } };
            }
            return item;
        });
        
        return {
            ...state,
            playerState: {
                ...state.playerState,
                inventory: newInventory
            }
        };
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
