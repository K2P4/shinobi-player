'use client';

import { motion } from 'framer-motion';
import { Heart, Pause } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import { Song } from '@/types/song';

interface SongCardProps {
  song: Song;
  index: number;
}

export default function SongCard({ song, index }: SongCardProps) {
  const { playSong, currentSong, isPlaying, favorites, toggleFavorite } = useAudio();
  const isActive = currentSong.id === song.id;
  const isFavorite = favorites.includes(song.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative bg-gradient-to-br from-[#1e1e1e] to-[#121212] rounded-xl p-3 md:p-4 border transition-all duration-300 ${
        isActive 
          ? 'border-[#FF9900] shadow-lg shadow-[#FF9900]/30' 
          : 'border-gray-800 hover:border-[#FF9900]/50'
      }`}
    >
      {/* Hidden Leaf Watermark */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <div className="absolute top-2 right-2 text-6xl">🍃</div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 relative z-10">
        {/* Cover Image */}
        <div className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 ${
          isActive ? 'ring-2 ring-[#FF9900]' : ''
        }`}>
          <img
            src={song.coverImg}
            alt={`${song.title} cover`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          {/* Play Button Overlay */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => playSong(song)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isActive && isPlaying ? (
              <Pause className="text-[#FF9900]" size={24} />
            ) : (
              <div className="text-[#FF9900] text-2xl"></div>
            )}
          </motion.button>
        </div>

        {/* Song Info */}
        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold truncate ${
            isActive ? 'text-[#FF9900]' : 'text-white'
          }`}>
            {song.title}
          </h3>
          <p className="text-sm text-gray-400 truncate">{song.artist}</p>
        </div>

        {/* Favorite Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleFavorite(song.id)}
          className={`p-2 rounded-full transition-colors ${
            isFavorite 
              ? 'text-[#FF9900]' 
              : 'text-gray-400 hover:text-[#FF9900]'
          }`}
        >
          <Heart size={20} fill={isFavorite ? '#FF9900' : 'none'} />
        </motion.button>

        {/* Active Indicator */}
        {isActive && isPlaying && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 h-8 bg-[#FF9900] rounded-full"
          />
        )}
      </div>
    </motion.div>
  );
}
