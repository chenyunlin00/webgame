import React from 'react';
import { ShelterPanel } from '../components/game/ShelterPanel';

export const ShelterPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">庇护所管理</h1>
      <ShelterPanel />
    </div>
  );
};
