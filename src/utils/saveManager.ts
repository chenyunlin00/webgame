import { GameSaveData } from '../types';
import { db } from '../db/db';

export class SaveManager {
  private static readonly SAVE_ID = 'current_save';
  
  static async saveGame(state: GameSaveData): Promise<boolean> {
    try {
      // IndexedDB (Dexie)
      await db.saves.put({ ...state, id: this.SAVE_ID });
      
      // LocalStorage Backup (Sync for faster initial load check)
      const serializedData = JSON.stringify(state);
      localStorage.setItem('post_apocalyptic_survival_save_backup', serializedData);
      
      return true;
    } catch (error) {
      console.error('Save failed:', error);
      return false;
    }
  }
  
  static async loadGame(): Promise<GameSaveData | null> {
    try {
      // Try IndexedDB first
      const save = await db.saves.get(this.SAVE_ID);
      
      if (save && this.validateSaveData(save)) {
        return save;
      }
      
      // Fallback to LocalStorage
      const localBackup = localStorage.getItem('post_apocalyptic_survival_save_backup');
      if (localBackup) {
        const parsed = JSON.parse(localBackup);
        if (this.validateSaveData(parsed)) {
          return parsed;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Load failed:', error);
      return null;
    }
  }
  
  private static validateSaveData(data: any): boolean {
    return data && 
           data.version && 
           data.playerState && 
           data.shelterState &&
           typeof data.timestamp === 'number';
  }

  static async clearSave(): Promise<void> {
    await db.saves.delete(this.SAVE_ID);
    localStorage.removeItem('post_apocalyptic_survival_save_backup');
  }
}
