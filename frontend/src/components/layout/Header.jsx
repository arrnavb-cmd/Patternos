import React from 'react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              PATTERNOS
            </h1>
            <span className="text-xs text-white/60 mt-1">
              Retail Media Intelligence OS
            </span>
          </div>
          
          <nav className="hidden md:flex gap-8">
            <a href="#dashboard" className="text-white/80 hover:text-cyan-400 transition-colors font-medium">
              Dashboard
            </a>
            <a href="#analytics" className="text-white/80 hover:text-cyan-400 transition-colors font-medium">
              Analytics
            </a>
            <a href="#campaigns" className="text-white/80 hover:text-cyan-400 transition-colors font-medium">
              Campaigns
            </a>
            <a href="#settings" className="text-white/80 hover:text-cyan-400 transition-colors font-medium">
              Settings
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
