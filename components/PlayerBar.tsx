'use client';

import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';

export default function PlayerBar() {
  const { currentSong, isPlaying, currentTime, duration, volume, togglePlay, playNext, playPrevious, seek, setVolume } = useAudio();

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#121212] backdrop-blur-xl bg-opacity-95 border-t border-[#FF9900]/20 p-3 md:p-4 z-50">
      <div className="mb-3 md:mb-4">
        <div className="flex items-center gap-2 md:gap-3 text-xs text-gray-400 mb-2">
          <span className="hidden sm:inline">{formatTime(currentTime)}</span>
          <div
            className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const percentage = x / rect.width;
              seek(percentage * duration);
            }}
          >
            <motion.div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#FF9900] shadow-lg shadow-[#3B82F6]/50" style={{ width: `${progress}%` }} />
          </div>
          <span className="hidden sm:inline">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 md:gap-4">
        <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg overflow-hidden flex-shrink-0">
            <img src={currentSong.coverImg} alt={`${currentSong.title} cover`} className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-white truncate text-sm md:text-base">{currentSong.title}</h4>
            <p className="text-xs md:text-sm text-gray-400 truncate">{currentSong.artist}</p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1 md:gap-4 flex-shrink-0">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={playPrevious} className="text-gray-400 hover:text-white transition-colors p-1 md:p-0">
            <SkipBack size={20} className="md:w-6 md:h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#FF9900] flex items-center justify-center text-black shadow-lg shadow-[#FF9900]/50 hover:bg-[#FF6600] transition-colors"
          >
            {isPlaying ? <Pause size={20} className="md:w-6 md:h-6" /> : <Play size={20} className="ml-0.5 md:ml-1 md:w-6 md:h-6" />}
          </motion.button>

          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={playNext} className="text-gray-400 hover:text-white transition-colors p-1 md:p-0">
            <SkipForward size={20} className="md:w-6 md:h-6" />
          </motion.button>
        </div>

        {/* Volume Control - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-3 flex-1 justify-end">
          <button onClick={() => setVolume(volume === 0 ? 0.7 : 0)} className="text-gray-400 hover:text-white transition-colors">
            {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 h-1 bg-gray-800 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #FF9900 0%, #FF9900 ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
