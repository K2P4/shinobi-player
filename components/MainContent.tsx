'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, List, Menu, X, Plus } from 'lucide-react';
import Sidebar from './Sidebar';
import SongCard from './SongCard';
import PlaylistCard from './PlaylistCard';
import PlayerBar from './PlayerBar';
import PlaylistManager from './PlaylistManager';
import { useAudio } from '@/hooks/useAudio';
import { songs } from '@/data/songs';

export default function MainContent() {
  const [currentView, setCurrentView] = useState('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [playlistManagerOpen, setPlaylistManagerOpen] = useState(false);
  const { favorites, playlists } = useAudio();

  const displaySongs = currentView === 'favorites' ? songs.filter((s) => favorites.includes(s.id)) : songs;

  return (
    <div className="h-screen bg-[#121212] text-white flex overflow-hidden">
      {/* Mobile  */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="fixed left-0 top-0 h-full z-50 md:hidden">
              <Sidebar
                currentView={currentView}
                setCurrentView={(view) => {
                  setCurrentView(view);
                  setSidebarOpen(false);
                }}
                isMobile={true}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop  */}
      <div className="hidden md:block">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      </div>

      <main className="flex-1 overflow-y-auto pb-24 md:pb-32">
        <div className="p-4 md:p-8">
          {/* Mobile  */}
          <div className="flex items-center justify-between mb-6 md:hidden">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <Menu size={24} />
            </motion.button>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#FF9900] to-[#FF6600] bg-clip-text text-transparent">Shinobi Player</h1>
            <div className="w-10" />
          </div>

          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-[#FF9900] via-[#FF6600] to-[#FF9900] bg-clip-text text-transparent">
                  {currentView === 'favorites' ? 'Your Favorites' : currentView === 'playlists' ? 'Your Playlists' : 'Naruto Openings'}
                </h2>
                <p className="text-gray-400 text-sm md:text-base">
                  {currentView === 'playlists' ? `${playlists.length} playlists` : `${displaySongs.length} songs . Enjoy your ninja way`}
                </p>
              </div>
              {currentView === 'playlists' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setPlaylistManagerOpen(true)}
                  className="p-3 bg-[#FF9900] text-black rounded-lg hover:bg-[#FF6600] transition-colors"
                >
                  <Plus size={20} />
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Songs  */}
          <div className="grid gap-3">
            <AnimatePresence mode="wait">
              {currentView === 'playlists' ? (
                playlists.length > 0 ? (
                  playlists.map((playlist, index) => <PlaylistCard key={playlist.id} playlist={playlist} index={index} />)
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-gray-400">
                    <List size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No playlists yet</p>
                    <p className="text-sm">Create your first playlist to get started!</p>
                  </motion.div>
                )
              ) : displaySongs.length > 0 ? (
                displaySongs.map((song, index) => <SongCard key={song.id} song={song} index={index} />)
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-gray-400">
                  <Heart size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No favorites yet. Start adding some songs!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <PlayerBar />

      <PlaylistManager isOpen={playlistManagerOpen} onClose={() => setPlaylistManagerOpen(false)} />
    </div>
  );
}
