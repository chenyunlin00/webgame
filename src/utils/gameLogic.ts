import { Season, InventoryItem, ItemType, HungerLevel } from '../types';

export class ComfortCalculator {
  static calculateComfort(
    baseComfort: number,
    clothing: InventoryItem[],
    shelterLevel: number,
    temperature: number,
    season: Season
  ): number {
    let comfort = baseComfort;
    
    // 衣物保暖加成 (Assuming we pass only equipped items or filter them)
    // Here we assume the passed 'clothing' array contains equipped items.
    // If it's the whole inventory, we should filter for equipped ones, but the type def doesn't specify 'equipped'.
    // For simplicity, let's assume we sum up warmth from all CLOTHING type items in inventory for now, 
    // or we might need an 'equipped' flag in InventoryItem later.
    // Based on PRD, "use clothing to increase warmth". Let's assume passive bonus from having them or "using" them.
    // Technical Architecture implies simple sum.
    const warmthBonus = clothing
      .filter(item => item.type === ItemType.CLOTHING)
      .reduce((total, item) => total + ((item.properties?.warmth || 0) * item.quantity), 0);
    
    // 庇护所保暖加成
    const shelterBonus = this.getShelterWarmthBonus(shelterLevel);
    
    // 季节温度影响
    const temperatureEffect = this.getTemperatureEffect(temperature, season);
    
    comfort = comfort + warmthBonus + shelterBonus - temperatureEffect;
    return Math.max(0, Math.min(100, comfort));
  }
  
  private static getShelterWarmthBonus(level: number): number {
    const bonuses = [0, 10, 25, 40]; // 无庇护所, 1级, 2级, 3级
    return bonuses[level] || 0;
  }
  
  private static getTemperatureEffect(temperature: number, season: Season): number {
    // This logic might need refinement based on actual temperature, 
    // but following the PRD/Tech Doc's simplified season-based logic:
    const effects = {
      [Season.SPRING]: 0,      // 15-25°C
      [Season.SUMMER]: 5,      // 25-35°C
      [Season.AUTUMN]: 10,     // 5-15°C
      [Season.WINTER]: 20      // -10-5°C
    };
    return effects[season];
  }
}

export class HungerSystem {
  static calculateHungerDecay(currentHunger: number, gameDay: number): number {
    // 基础饥饿值消耗：每天10点
    const baseDecay = 10;
    
    // 长期生存惩罚：每10天额外消耗1点
    const longTermPenalty = Math.floor(gameDay / 10);
    
    const totalDecay = baseDecay + longTermPenalty;
    return Math.max(0, currentHunger - totalDecay);
  }
  
  static getHungerWarningLevel(hunger: number): HungerLevel {
    if (hunger >= 70) return HungerLevel.FULL;
    if (hunger >= 30) return HungerLevel.NORMAL;
    if (hunger >= 10) return HungerLevel.HUNGRY;
    return HungerLevel.STARVING;
  }
}
