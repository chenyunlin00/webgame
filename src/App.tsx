import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { Layout } from './components/ui/Layout';
import { Dashboard } from './pages/Dashboard';
import { ShelterPage } from './pages/ShelterPage';
import { InventoryPage } from './pages/InventoryPage';
import { CraftingPage } from './pages/CraftingPage';
import { ExplorePage } from './pages/ExplorePage';
import { GameOverModal } from './components/game/GameOverModal';
import { VictoryModal } from './components/game/VictoryModal';

const App: React.FC = () => {
  return (
    <GameProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/shelter" element={<ShelterPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/crafting" element={<CraftingPage />} />
            <Route path="/explore" element={<ExplorePage />} />
          </Routes>
        </Layout>
        <GameOverModal />
        <VictoryModal />
      </Router>
    </GameProvider>
  );
};

export default App;
