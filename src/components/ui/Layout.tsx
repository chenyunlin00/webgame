import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { StatusBar } from './StatusBar';

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
      <Navbar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <StatusBar />
        <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
