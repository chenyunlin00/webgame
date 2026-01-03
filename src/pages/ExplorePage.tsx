import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { explorationAreas } from '../data/explorationData';
import { enemies } from '../data/enemies';
import { ExplorationArea, EventType, Enemy } from '../types';
import { Map, ArrowRight, Clock, Zap, Sword, Skull, Heart, Shield, Backpack, Lock, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import clsx from 'clsx';
import { soundManager } from '../utils/SoundManager';

export const ExplorePage: React.FC = () => {
  const { state, dispatch } = useGame();
  const { playerState } = state;
  
  // UI States
  const [exploringArea, setExploringArea] = useState<ExplorationArea | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isExploring, setIsExploring] = useState(false);
  const [canLeave, setCanLeave] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.isAudioMuted());
  const logsEndRef = useRef<HTMLDivElement>(null);

  const [foundSecretTunnel, setFoundSecretTunnel] = useState(false);

  // Toggle Mute
  const toggleMute = () => {
    const newState = !isMuted;
    setIsMuted(newState);
    soundManager.setMute(newState);
  };

  // Combat State
  const [combatState, setCombatState] = useState<{
    enemy: Enemy;
    currentEnemyHp: number;
    isPlayerTurn: boolean;
    specialEffect?: 'urchin_attached';
  } | null>(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, combatState]);

  // Urchin Bleed Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (combatState?.specialEffect === 'urchin_attached' && isExploring) {
      interval = setInterval(() => {
        addLog('剧毒海胆吸附在你身上，造成持续伤害！ (-3 HP)');
        dispatch({ type: 'UPDATE_STATS', payload: { stat: 'health', value: -3 } });
        
        // Check Death
        if (playerState.health <= 3) {
           addLog('你被海胆毒死了...');
           setCombatState(null);
           setCanLeave(true);
           clearInterval(interval);
        }
      }, 3000); // Every 3 seconds (simulating "minute" or fast paced turn)
    }
    return () => clearInterval(interval);
  }, [combatState, isExploring, playerState.health]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, message]);
  };

  const hasDivingSuit = () => {
    return playerState.inventory.some(item => item.id === 'diving_suit');
  };

  const handleStartExplore = async (area: ExplorationArea) => {
    if (area.id === 'deep_sea' && !hasDivingSuit()) {
      alert('你需要潜水服才能进入深海！请先在制作页面制作潜水服。');
      return;
    }

    if (playerState.energy < area.energyCost) {
      alert('体力不足，无法探索该区域！请先休息。');
      return;
    }

    // Initialize Exploration
    setExploringArea(area);
    setLogs([]);
    setIsExploring(true);
    setCanLeave(false);
    setCombatState(null);
    setFoundSecretTunnel(false); // Reset secret tunnel state

    // Deduct Energy
    dispatch({ type: 'UPDATE_STATS', payload: { stat: 'energy', value: -area.energyCost } });
    dispatch({ type: 'TICK' });

    // Exploration Sequence
    addLog(`你出发前往 ${area.name}...`);
    await wait(1000);
    addLog(area.description);
    await wait(1000);
    addLog('正在搜寻周围的环境...');
    await wait(1500);

    // Trigger Event
    triggerEvent(area);
  };

  const triggerEvent = async (area: ExplorationArea) => {
    // Select Event Logic
    const totalProb = area.possibleEvents.reduce((acc, e) => acc + e.probability, 0);
    let randomValue = Math.random() * totalProb;
    let selectedEvent = area.possibleEvents[0];

    for (const event of area.possibleEvents) {
      randomValue -= event.probability;
      if (randomValue <= 0) {
        selectedEvent = event;
        break;
      }
    }

    addLog(`[事件] ${selectedEvent.description}`);
    await wait(1000);

    // Check for Combat
    if (selectedEvent.enemyId && enemies[selectedEvent.enemyId]) {
      const enemy = enemies[selectedEvent.enemyId];
      startCombat(enemy);
    } else {
      // Regular Event Outcomes
      if (selectedEvent.outcomes.length === 0) {
        addLog('这里似乎什么都没有。');
      } else {
        for (const outcome of selectedEvent.outcomes) {
          const outcomeRand = Math.random();
          if (outcomeRand <= outcome.probability) {
            addLog(`> ${outcome.message}`);
            
            if (outcome.type === 'item') {
              dispatch({ type: 'ADD_ITEM', payload: { item: outcome.value } });
            } else if (outcome.type === 'status') {
               dispatch({ type: 'UPDATE_STATS', payload: outcome.value });
            }
          }
        }
      }
      setCanLeave(true);
    }
  };

  const startCombat = (enemy: Enemy) => {
    addLog(`!!! 遭遇敌对生物: ${enemy.name} (HP: ${enemy.maxHp}) !!!`);
    addLog(enemy.description);
    
    // Play Combat Music
    // Using a reliable open source game music URL (Phaser 3 Examples)
    soundManager.playBGM('https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/audio/oedipus_ark_pandora.mp3');

    let specialEffect: 'urchin_attached' | undefined = undefined;
    if (enemy.id === 'urchin') {
      specialEffect = 'urchin_attached';
      addLog('海胆死死吸附在你的皮肤上，必须攻击它才能将其剥离！');
    }

    setCombatState({
      enemy,
      currentEnemyHp: enemy.maxHp,
      isPlayerTurn: true,
      specialEffect
    });
  };

  const handleCombatAction = async (action: 'attack' | 'flee') => {
    if (!combatState || !isExploring) return;

    if (action === 'flee') {
      if (combatState.specialEffect === 'urchin_attached') {
        addLog('海胆吸附在身上，无法逃跑！必须将它击落！');
        return;
      }

      const fleeChance = 0.4; // 40% chance to flee
      addLog('你试图逃跑...');
      await wait(800);
      
      if (Math.random() < fleeChance) {
        addLog('你成功逃脱了！');
        soundManager.playFleeSound();
        soundManager.fadeOutBGM();
        setCombatState(null);
        setCanLeave(true);
      } else {
        addLog('逃跑失败！敌人追了上来！');
        await enemyTurn(combatState.enemy, combatState.currentEnemyHp);
      }
      return;
    }

    // Player Attack
    // Calculate Damage based on equipment
    const weaponAttack = playerState.equipment.weapon?.properties?.attackPower || 0;
    const baseAttack = 5;
    const playerDamage = Math.floor(Math.random() * 10) + baseAttack + weaponAttack;

    const newEnemyHp = Math.max(0, combatState.currentEnemyHp - playerDamage);
    
    soundManager.playAttackSound();
    addLog(`你攻击了 ${combatState.enemy.name}，造成了 ${playerDamage} 点伤害！${weaponAttack > 0 ? `(武器加成 +${weaponAttack})` : ''}`);
    
    // Urchin Detachment Logic
    if (combatState.enemy.id === 'urchin') {
        // Urchin maxHp is 3. If damage >= 3 (accumulated or single hit? User said "attack 3 drops blood", likely means 3 damage total or hits?)
        // "攻击海胆3滴血后" -> Means damage >= 3. Since player damage is 5-15, one hit is enough.
        // Let's assume one hit kills/detaches it since maxHp is 3.
        if (newEnemyHp <= 0) {
           addLog('你成功将海胆从身上击落并踩碎了它！');
        }
    }

    setCombatState(prev => prev ? { ...prev, currentEnemyHp: newEnemyHp, isPlayerTurn: false } : null);

    if (newEnemyHp <= 0) {
      await wait(500);
      handleCombatVictory(combatState.enemy);
      return;
    }

    // Enemy Turn
    await wait(1000);
    await enemyTurn(combatState.enemy, newEnemyHp);
  };

  const enemyTurn = async (enemy: Enemy, currentEnemyHp: number) => {
    // Urchin doesn't attack normally, it does DOT.
    if (enemy.id === 'urchin') {
       // Urchin turn pass, damage is handled via interval
       setCombatState(prev => prev ? { ...prev, currentEnemyHp, isPlayerTurn: true } : null);
       return;
    }

    // Calculate Defense
    const armorDefense = playerState.equipment.armor?.properties?.defensePower || 0;

    const enemyDamage = Math.floor(Math.random() * 5) + (enemy.attack - 2); // Variation
    // Apply Defense
    const actualDamage = Math.max(1, enemyDamage - armorDefense); // Minimum 1 damage

    soundManager.playHitSound();
    
    let logMsg = `${enemy.name} 攻击了你，造成了 ${actualDamage} 点伤害！`;
    if (armorDefense > 0) {
        logMsg += ` (护甲抵消了 ${Math.min(enemyDamage, armorDefense)} 点伤害)`;
    }
    addLog(logMsg);
    
    dispatch({ type: 'UPDATE_STATS', payload: { stat: 'health', value: -actualDamage } });

    // Check Player Death
    if (playerState.health - actualDamage <= 0) {
      addLog('你受了重伤，无法继续战斗...');
      soundManager.playDefeatSound();
      soundManager.fadeOutBGM(500);
      setCombatState(null);
      setCanLeave(true);
      return;
    }

    setCombatState(prev => prev ? { ...prev, currentEnemyHp, isPlayerTurn: true } : null);
  };

  const handleCombatVictory = (enemy: Enemy) => {
    addLog(`你击败了 ${enemy.name}！`);
    soundManager.playVictorySound();
    soundManager.fadeOutBGM();

    // Deep Sea Victory Condition
    if (enemy.id === 'shark') {
        const chance = Math.random();
        if (chance <= 0.5) { // 50% chance to find the tunnel
            addLog('在巨齿鲨的巢穴深处，你发现了一个发出幽幽蓝光的洞穴入口...');
            addLog('那似乎是传说中的海底隧道，可能通往安全的地方！');
            setFoundSecretTunnel(true);
        } else {
            addLog('你在鲨鱼的领地搜寻了一番，除了一些残骸外一无所获。');
        }
    }
    
    // Loot generation
    if (enemy.loot) {
      enemy.loot.forEach(lootItem => {
        if (Math.random() <= lootItem.probability) {
           const item: any = {
             id: lootItem.itemId,
             name: getItemName(lootItem.itemId),
             type: 'material', // Default fallback
             quantity: lootItem.quantity
           };
           
           // Special properties for known items
           // FIX: Correctly assign type and properties for specific items
           if (item.id === 'shark_meat' || item.id === 'raw_meat' || item.id === 'yellow_croaker' || item.id === 'canned_food' || item.id === 'urchin_meat') {
             item.type = 'food';
             if (item.id === 'shark_meat') item.properties = { hungerRestore: 100, comfortBonus: 50 };
             if (item.id === 'raw_meat') item.properties = { hungerRestore: 15 };
             if (item.id === 'yellow_croaker') item.properties = { hungerRestore: 15 };
             if (item.id === 'canned_food') item.properties = { hungerRestore: 30 };
             if (item.id === 'urchin_meat') item.properties = { hungerRestore: 20 };
           } else if (item.id === 'water' || item.id === 'water_bottle') {
             item.type = 'water';
             item.properties = { hungerRestore: 10, comfortBonus: 5 };
           } else if (item.id === 'herbs' || item.id === 'first_aid_kit') {
             item.type = 'medicine';
             if (item.id === 'herbs') item.properties = { healthRestore: 15 };
             if (item.id === 'first_aid_kit') item.properties = { healthRestore: 50 };
           } else if (item.id === 'shark_skin' || item.id === 'cloth' || item.id === 'leather') {
               item.type = 'material';
           }

           dispatch({ type: 'ADD_ITEM', payload: { item } });
           addLog(`获得了 ${item.name} x${item.quantity}`);
        }
      });
    }
    
    setCombatState(null);
    setCanLeave(true);
  };

  const handleLeave = () => {
    setExploringArea(null);
    setIsExploring(false);
    setLogs([]);
    setCanLeave(false);
    setFoundSecretTunnel(false);
  };

  const handleEnterTunnel = () => {
      dispatch({ type: 'WIN_GAME', payload: { type: 'deep_sea' } });
  };

  const handleReExplore = () => {
    if (exploringArea) {
        handleStartExplore(exploringArea);
    }
  };

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Helper to get name (Temporary solution)
  const getItemName = (id: string) => {
    const map: Record<string, string> = {
      'wood': '木材',
      'stone': '石材',
      'metal': '金属',
      'herbs': '草药',
      'raw_meat': '生肉',
      'cloth': '布料',
      'canned_food': '罐头',
      'water_bottle': '瓶装水',
      'water': '水',
      'scrap_metal': '废金属',
      'plastic': '塑料',
      'coral': '珊瑚',
      'yellow_croaker': '小黄鱼',
      'shark_meat': '巨齿鲨肉',
      'shark_skin': '巨齿鲨皮',
      'urchin_meat': '海胆肉',
      'jellyfish_tentacle': '水母触须',
      'octopus_leg': '章鱼足',
      'first_aid_kit': '急救包',
      'electronic_parts': '电子元件'
    };
    return map[id] || id;
  };

  const [showResourcesFor, setShowResourcesFor] = useState<string | null>(null);

  // Render Logic
  if (exploringArea) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-white">正在探索: {exploringArea.name}</h1>
            <button 
              onClick={toggleMute}
              className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              title={isMuted ? "开启音效" : "静音"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
          {canLeave && (
            <div className="flex gap-3">
                {foundSecretTunnel && (
                    <button 
                    onClick={handleEnterTunnel}
                    className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white transition-colors animate-pulse shadow-lg shadow-cyan-500/50 font-bold"
                    >
                    进入深海隧道 (胜利)
                    </button>
                )}
                <button 
                onClick={handleReExplore}
                disabled={playerState.energy < (exploringArea?.energyCost || 0)}
                className={clsx(
                    "px-4 py-2 rounded-lg text-white transition-colors flex items-center",
                    playerState.energy >= (exploringArea?.energyCost || 0) 
                        ? "bg-orange-600 hover:bg-orange-500" 
                        : "bg-slate-700 text-slate-500 cursor-not-allowed"
                )}
                title="再次探索该区域"
                >
                <RotateCcw className="w-4 h-4 mr-2" />
                再次探索
                </button>
                <button 
                onClick={handleLeave}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                >
                返回基地
                </button>
            </div>
          )}
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
          {/* Log Area */}
          <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-700 p-6 overflow-y-auto flex flex-col h-[60vh] lg:h-auto">
            <div className="space-y-3 flex-1">
              {logs.map((log, idx) => (
                <div key={idx} className="text-slate-300 animate-fade-in border-b border-slate-800/50 pb-2 last:border-0">
                  {log.startsWith('!!!') ? (
                    <span className="text-red-500 font-bold">{log}</span>
                  ) : log.startsWith('>') ? (
                    <span className="text-green-400">{log}</span>
                  ) : (
                    log
                  )}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
            
            {/* Combat Actions */}
            {combatState && (
              <div className="mt-6 pt-6 border-t border-slate-700 animate-slide-up">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <Sword className="w-5 h-5 text-red-500" />
                    <span className="text-white font-bold">战斗中</span>
                  </div>
                  {combatState.isPlayerTurn && <span className="text-orange-400 text-sm animate-pulse">你的回合</span>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleCombatAction('attack')}
                    disabled={!combatState.isPlayerTurn}
                    className="py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Sword className="w-4 h-4" />
                    <span>攻击</span>
                  </button>
                  <button
                    onClick={() => handleCombatAction('flee')}
                    disabled={!combatState.isPlayerTurn}
                    className="py-3 bg-slate-600 hover:bg-slate-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-bold flex items-center justify-center space-x-2 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>逃跑</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Status / Enemy Panel */}
          <div className="space-y-6">
            {/* Player Status */}
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-400" />
                你的状态
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-slate-400 mb-1">
                    <span>生命值</span>
                    <span>{playerState.health}/100</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-500 transition-all duration-300"
                      style={{ width: `${playerState.health}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-slate-400 mb-1">
                    <span>体力</span>
                    <span>{playerState.energy}/100</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-500 transition-all duration-300"
                      style={{ width: `${playerState.energy}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Enemy Status */}
            {combatState && (
              <div className="bg-slate-800 rounded-xl p-4 border border-red-900/50 animate-fade-in">
                <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center">
                  <Skull className="w-5 h-5 mr-2" />
                  {combatState.enemy.name}
                </h3>
                <div>
                  <div className="flex justify-between text-sm text-slate-400 mb-1">
                    <span>生命值</span>
                    <span>{combatState.currentEnemyHp}/{combatState.enemy.maxHp}</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-red-600 transition-all duration-300"
                      style={{ width: `${(combatState.currentEnemyHp / combatState.enemy.maxHp) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="mt-4 text-sm text-slate-400">
                  <p>攻击力: <span className="text-slate-200">{combatState.enemy.attack}</span></p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default View (Area Selection)
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">外出探索</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {explorationAreas.map(area => {
          const isLocked = area.id === 'deep_sea' && !hasDivingSuit();
          
          return (
            <div key={area.id} className={clsx(
              "bg-slate-800 rounded-xl overflow-hidden border border-slate-700 transition-colors group relative",
              !isLocked && "hover:border-orange-500"
            )}>
              {isLocked && (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-10 flex-col">
                  <Lock className="w-12 h-12 text-slate-500 mb-2" />
                  <p className="text-slate-400 font-bold">需要潜水服解锁</p>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-200 group-hover:text-orange-500 transition-colors">{area.name}</h3>
                  <span className={clsx(
                    "px-2 py-1 rounded text-xs font-bold",
                    area.riskLevel <= 2 ? "bg-green-900 text-green-400" : 
                    area.riskLevel <= 3 ? "bg-yellow-900 text-yellow-400" : 
                    "bg-red-900 text-red-400"
                  )}>
                    危险度: {area.riskLevel}
                  </span>
                </div>
                
                <p className="text-slate-400 text-sm mb-6 h-10">{area.description}</p>
                
                <div className="flex items-center justify-between text-sm text-slate-500 mb-6">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{area.timeRequired}h</span>
                  </div>
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 mr-1 text-yellow-500" />
                    <span>-{area.energyCost}</span>
                  </div>
                  <div className="relative">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowResourcesFor(showResourcesFor === area.id ? null : area.id);
                        }}
                        className="flex items-center hover:text-blue-400 transition-colors focus:outline-none"
                    >
                        <Map className="w-4 h-4 mr-1 text-blue-500" />
                        <span>资源: {area.resourcePotential}</span>
                    </button>
                    
                    {showResourcesFor === area.id && area.resourceList && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 border border-slate-600 rounded-lg p-3 shadow-xl z-20 w-48 animate-fade-in">
                            <h4 className="text-xs font-bold text-slate-400 mb-2 border-b border-slate-700 pb-1">潜在资源</h4>
                            <div className="space-y-1">
                                {area.resourceList.map(resId => (
                                    <div key={resId} className="text-xs text-slate-300 flex items-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></div>
                                        {getItemName(resId)}
                                    </div>
                                ))}
                            </div>
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-600"></div>
                        </div>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleStartExplore(area)}
                  disabled={isLocked || playerState.energy < area.energyCost}
                  className={clsx(
                    "w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center",
                    !isLocked && playerState.energy >= area.energyCost
                      ? "bg-orange-600 hover:bg-orange-700 text-white"
                      : "bg-slate-700 text-slate-500 cursor-not-allowed"
                  )}
                >
                  {isLocked ? '未解锁' : playerState.energy >= area.energyCost ? '出发探索' : '体力不足'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
