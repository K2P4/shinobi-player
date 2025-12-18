'use client';

import { motion } from 'framer-motion';
import { Home, Heart, List } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  isMobile?: boolean;
}

export default function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  return (
    <motion.div 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 md:w-72 bg-gradient-to-b  h-lvh from-[#1a1a1a] to-[#121212] backdrop-blur-xl bg-opacity-90 border-r border-[#FF9900]/20 flex flex-col"
    >
      <div className="p-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF9900] to-[#FF6600] bg-clip-text text-transparent">
          Shinobi Player
        </h1>
        <p className="text-xs text-gray-400 mt-1">Ninja Way Playlist</p>
      </div>

      <nav className="flex-1 px-3">
        {[
          { id: 'home', label: 'All Openings', icon: Home },
          { id: 'favorites', label: 'Favorites', icon: Heart },
          { id: 'playlists', label: 'Playlists', icon: List }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
              currentView === item.id 
                ? 'bg-[#FF9900] text-black font-semibold shadow-lg shadow-[#FF9900]/30' 
                : 'text-gray-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>


    </motion.div>
  );
}
