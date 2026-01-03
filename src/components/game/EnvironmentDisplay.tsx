import React from 'react';
import { Season } from '../../types';
import { Sun, CloudRain, Snowflake, Wind, Calendar } from 'lucide-react';

interface EnvironmentDisplayProps {
  season: Season;
  temperature: number;
  day: number;
}

export const EnvironmentDisplay: React.FC<EnvironmentDisplayProps> = ({ season, temperature, day }) => {
  const getSeasonInfo = (season: Season) => {
    switch (season) {
      case Season.SPRING:
        return { name: '春季', icon: Wind, color: 'text-green-400' };
      case Season.SUMMER:
        return { name: '夏季', icon: Sun, color: 'text-orange-400' };
      case Season.AUTUMN:
        return { name: '秋季', icon: CloudRain, color: 'text-yellow-600' };
      case Season.WINTER:
        return { name: '冬季', icon: Snowflake, color: 'text-cyan-400' };
    }
  };

  const { name, icon: Icon, color } = getSeasonInfo(season);

  return (
    <div className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700 flex items-center justify-between">
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-slate-700 mr-4 ${color}`}>
          <Icon className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-100">{name}</h3>
          <p className="text-slate-400 text-sm">温度: {temperature}°C</p>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center justify-end text-slate-300 mb-1">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-sm">生存天数</span>
        </div>
        <p className="text-2xl font-bold text-white">第 {day} 天</p>
      </div>
    </div>
  );
};
