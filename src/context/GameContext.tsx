import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { GameSaveData } from '../types';
import { gameReducer, GameAction, initialState } from './gameReducer';
import { SaveManager } from '../utils/saveManager';

interface GameContextType {
  state: GameSaveData;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load game on mount
  useEffect(() => {
    const load = async () => {
      const savedGame = await SaveManager.loadGame();
      if (savedGame) {
        dispatch({ type: 'LOAD_GAME', payload: savedGame });
      }
    };
    load();
  }, []);

  // Auto save
  useEffect(() => {
    if (state.isGameOver) return; // Don't auto save on game over

    const interval = setInterval(() => {
      SaveManager.saveGame(state);
    }, 60 * 1000); // Save every 1 minute now (more frequent)

    return () => clearInterval(interval);
  }, [state]);

  // Save on state change and unload
  useEffect(() => {
      // Don't save if game over to prevent loop
      if (state.isGameOver) return;

      const handleVisibilityChange = () => {
          if (document.visibilityState === 'hidden') {
              SaveManager.saveGame(state);
          }
      };
      
      const handleBeforeUnload = () => {
         SaveManager.saveGame(state);
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
