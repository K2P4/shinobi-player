'use client';

import React, { createContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Song } from '@/types/song';
import { songs } from '@/data/songs';

interface AudioContextType {
  currentSong: Song;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  favorites: number[];
  playSong: (song: Song) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleFavorite: (songId: number) => void;
}

export const AudioContext = createContext<AudioContextType | null>(null);

export const AudioProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentSong, setCurrentSong] = useState<Song>(songs[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load saved preferences on mount
  useEffect(() => {
    const savedVolume = localStorage.getItem('volume');
    const savedFavorites = localStorage.getItem('favorites');
    const savedSongId = localStorage.getItem('lastPlayedSong');

    if (savedVolume) setVolume(parseFloat(savedVolume));
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedSongId) {
      const song = songs.find(s => s.id === parseInt(savedSongId));
      if (song) setCurrentSong(song);
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('volume', volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('lastPlayedSong', currentSong.id.toString());
  }, [currentSong]);

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => playNext();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setTimeout(() => audioRef.current?.play(), 100);
  };

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length; // Ninja Way Loop!
    playSong(songs[nextIndex]);
  };

  const playPrevious = () => {
    const currentIndex = songs.findIndex(s => s.id === currentSong.id);
    const prevIndex = currentIndex === 0 ? songs.length - 1 : currentIndex - 1;
    playSong(songs[prevIndex]);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleFavorite = (songId: number) => {
    setFavorites(prev => 
      prev.includes(songId) 
        ? prev.filter(id => id !== songId)
        : [...prev, songId]
    );
  };

  return (
    <AudioContext.Provider value={{
      currentSong,
      isPlaying,
      currentTime,
      duration,
      volume,
      favorites,
      playSong,
      togglePlay,
      playNext,
      playPrevious,
      seek,
      setVolume,
      toggleFavorite
    }}>
      <audio ref={audioRef} src={currentSong.audioSrc} />
      {children}
    </AudioContext.Provider>
  );
};