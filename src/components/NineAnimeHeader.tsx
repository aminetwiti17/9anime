import React, { useState } from 'react';
import { Search, Menu, Filter } from 'lucide-react';

export const NineAnimeHeader: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-[#1a1a1a] border-b border-gray-800">
      <div className="flex items-center px-4 py-3">
        {/* Menu hamburger */}
        <button className="text-white mr-4">
          <Menu className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="flex items-center mr-8">
          <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mr-2">
            <span className="text-white text-sm font-bold">9</span>
          </div>
          <span className="text-white font-bold text-lg">Anime</span>
        </div>

        {/* Search bar */}
        <div className="flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};