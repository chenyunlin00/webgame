import Dexie, { Table } from 'dexie';
import { GameSaveData } from '../types';

export class GameDatabase extends Dexie {
  saves!: Table<GameSaveData & { id: string }>;

  constructor() {
    super('PostApocalypticSurvivalDB');
    this.version(1).stores({
      saves: 'id, timestamp' // Primary key and indexed props
    });
  }
}

export const db = new GameDatabase();
