'use client';

import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Pause, Download, Plus, Check, X } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import { Song } from '@/types/song';

interface SongCardProps {
  song: Song;
  index: number;
}

function SongCard({ song, index }: SongCardProps) {
  const { playSong, currentSong, isPlaying, favorites, toggleFavorite, playlists, addSongToPlaylist, removeSongFromPlaylist } = useAudio();
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const isActive = currentSong.id === song.id;
  const isFavorite = favorites.includes(song.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative bg-gradient-to-br from-[#1e1e1e] to-[#121212] rounded-xl p-3 md:p-4 border transition-all duration-300 ${
        isActive ? 'border-[#FF9900] shadow-lg shadow-[#FF9900]/30' : 'border-gray-800 hover:border-[#FF9900]/50'
      }`}
    >
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <div className="absolute top-2 right-2 text-6xl">🍃</div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 relative z-10">
        <div className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 ${isActive ? 'ring-2 ring-[#FF9900]' : ''}`}>
          <img src={song.coverImg} alt={`${song.title} cover`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy" />

          {/* Play Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => playSong(song)}
            className="absolute inset-0 bg-black/10 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isActive && isPlaying ? <Pause className="text-[#FF9900]" size={24} /> : <div className="text-[#FF9900] text-2xl">🍥</div>}
          </motion.button>
        </div>

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold truncate ${isActive ? 'text-[#FF9900]' : 'text-white'}`}>{song.title}</h3>
          <p className="text-sm text-gray-400 truncate">{song.artist}</p>
        </div>

        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleFavorite(song.id)}
          className={`p-2 rounded-full transition-colors ${isFavorite ? 'text-[#FF9900]' : 'text-gray-400 hover:text-[#FF9900]'}`}
        >
          <Heart size={20} fill={isFavorite ? '#FF9900' : 'none'} />
        </motion.button>

        {/* Download Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            const link = document.createElement('a');
            link.href = song.audioSrc;
            link.download = `${song.title} - ${song.artist}.mp3`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="p-2 rounded-full text-gray-400 hover:text-[#FF9900] transition-colors opacity-0 group-hover:opacity-100"
        >
          <Download size={20} />
        </motion.button>

        {/* Add to Playlist Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            setShowPlaylistModal(true);
          }}
          className="p-2 rounded-full text-gray-400 hover:text-[#FF9900] transition-colors opacity-0 group-hover:opacity-100"
        >
          <Plus size={20} />
        </motion.button>

        {isActive && isPlaying && <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1 h-8 bg-[#FF9900] rounded-full" />}
      </div>

      {/* Playlist Modal */}
      <AnimatePresence>
        {showPlaylistModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowPlaylistModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Add to Playlist</h2>
                  <button
                    onClick={() => setShowPlaylistModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex items-center gap-3 p-3 bg-[#2a2a2a] rounded-lg">
                    <img src={song.coverImg} alt={song.title} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{song.title}</h3>
                      <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-gray-400 mb-3">Select playlists to add this song:</div>
                  {playlists.length > 0 ? (
                    playlists.map((playlist) => {
                      const isInPlaylist = playlist.songIds.includes(song.id);
                      return (
                        <motion.button
                          key={playlist.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            if (isInPlaylist) {
                              removeSongFromPlaylist(playlist.id, song.id);
                            } else {
                              addSongToPlaylist(playlist.id, song.id);
                            }
                          }}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                            isInPlaylist ? 'bg-[#FF9900]/20 border border-[#FF9900]/30' : 'bg-[#2a2a2a] hover:bg-[#3a3a3a]'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isInPlaylist ? 'border-[#FF9900] bg-[#FF9900]' : 'border-gray-400'
                          }`}>
                            {isInPlaylist && <Check size={12} className="text-black" />}
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-white truncate">{playlist.name}</div>
                            <div className="text-sm text-gray-400">{playlist.songIds.length} songs</div>
                          </div>
                        </motion.button>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <div className="text-sm">No playlists yet</div>
                      <div className="text-xs mt-1">Create playlists in the Playlists tab</div>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowPlaylistModal(false)}
                    className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default memo(SongCard);
