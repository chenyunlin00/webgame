import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Tent, Backpack, Hammer, Map as MapIcon } from 'lucide-react';
import clsx from 'clsx';

export const Navbar: React.FC = () => {
  const navItems = [
    { name: '首页', path: '/', icon: Home },
    { name: '庇护所', path: '/shelter', icon: Tent },
    { name: '背包', path: '/inventory', icon: Backpack },
    { name: '制作', path: '/crafting', icon: Hammer },
    { name: '探索', path: '/explore', icon: MapIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 md:relative md:border-t-0 md:bg-slate-900 md:w-64 md:h-screen md:flex-col md:border-r">
      <div className="flex justify-around items-center h-16 md:flex-col md:h-full md:justify-start md:p-4 md:space-y-2">
        <div className="hidden md:block text-2xl font-bold text-orange-500 mb-8 mt-4">
          末日生存
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex flex-col md:flex-row items-center justify-center md:justify-start p-2 rounded-lg transition-colors w-full',
                isActive
                  ? 'text-orange-500 bg-slate-800'
                  : 'text-slate-400 hover:text-orange-400 hover:bg-slate-800'
              )
            }
          >
            <item.icon className="w-6 h-6 md:mr-3" />
            <span className="text-xs md:text-base mt-1 md:mt-0">{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
