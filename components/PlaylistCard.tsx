'use client';

import { memo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, MoreVertical, Trash2 } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import { Playlist } from '@/types/playlist';
import { songs } from '@/data/songs';

interface PlaylistCardProps {
  playlist: Playlist;
  index: number;
}

function PlaylistCard({ playlist, index }: PlaylistCardProps) {
  const { playSong, deletePlaylist } = useAudio();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const playlistSongs = songs.filter(song => playlist.songIds.includes(song.id));
  const firstSong = playlistSongs[0];

  const handlePlay = () => {
    if (playlistSongs.length > 0) {
      playSong(playlistSongs[0]);
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${playlist.name}"?`)) {
      deletePlaylist(playlist.id);
    }
    setShowMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative bg-gradient-to-br from-[#1e1e1e] to-[#121212] rounded-xl p-4 border border-gray-800 hover:border-[#FF9900]/50 transition-all duration-300"
    >
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <div className="absolute top-2 right-2 text-6xl">🍃</div>
      </div>

      <div className="flex items-center gap-4 relative z-10">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#FF9900] to-[#FF6600] flex items-center justify-center">
          {firstSong ? (
            <img src={firstSong.coverImg} alt={`${playlist.name} cover`} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <Music size={24} className="text-white" />
          )}

          {/* Play Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePlay}
            disabled={playlistSongs.length === 0}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30"
          >
            <Play className="text-[#FF9900]" size={24} />
          </motion.button>
        </div>

        {/* Playlist Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate text-lg">{playlist.name}</h3>
          <p className="text-sm text-gray-400 truncate">
            {playlist.songIds.length} songs • Created {new Date(playlist.createdAt).toLocaleDateString()}
          </p>
          {playlist.description && (
            <p className="text-xs text-gray-500 truncate mt-1">{playlist.description}</p>
          )}
        </div>

        {/* Options Button */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-2 text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
          >
            <MoreVertical size={20} />
          </motion.button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {showMenu && (
              <motion.div
                ref={menuRef}
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="absolute right-0 top-full mt-2 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl z-50 min-w-32"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[#2a2a2a] rounded-lg text-sm transition-colors text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                  Delete 
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(PlaylistCard);
