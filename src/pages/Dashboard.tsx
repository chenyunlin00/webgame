import React from 'react';
import { useGame } from '../context/GameContext';
import { StatusPanel } from '../components/game/StatusPanel';
import { EnvironmentDisplay } from '../components/game/EnvironmentDisplay';
import { ActionButtons } from '../components/game/ActionButtons';
import { EventLog } from '../components/game/EventLog';

import { Save } from 'lucide-react';
import { SaveManager } from '../utils/saveManager';

export const Dashboard: React.FC = () => {
  const { state } = useGame();
  const { playerState, eventLogs } = state;

  const handleManualSave = async () => {
      const success = await SaveManager.saveGame(state);
      if (success) {
          alert('游戏保存成功！');
      } else {
          alert('保存失败，请重试。');
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
          <EnvironmentDisplay 
            season={playerState.currentSeason} 
            temperature={playerState.currentTemperature} 
            day={playerState.gameDay} 
          />
          <button 
            onClick={handleManualSave}
            className="flex items-center px-4 py-2 bg-green-700 hover:bg-green-600 rounded-lg text-white transition-colors"
          >
              <Save className="w-4 h-4 mr-2" />
              保存游戏
          </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <StatusPanel 
            hunger={playerState.hunger}
            comfort={playerState.comfort}
            health={playerState.health}
            energy={playerState.energy}
          />
        </div>
        
        <div className="md:col-span-2">
          <EventLog logs={eventLogs} />
        </div>
      </div>
      
      <ActionButtons />
    </div>
  );
};
