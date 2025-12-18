'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Edit2, Trash2, Music } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import { Playlist } from '@/types/playlist';

export default function PlaylistManager({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { playlists, createPlaylist, deletePlaylist } = useAudio();
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim(), newPlaylistDesc.trim() || undefined);
      setNewPlaylistName('');
      setNewPlaylistDesc('');
      setIsCreating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#1a1a1a] rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Manage Playlists</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {!isCreating && (
                  <button
                    onClick={() => setIsCreating(true)}
                    className="w-full flex items-center gap-3 p-3 bg-[#FF9900] text-black rounded-lg hover:bg-[#FF6600] transition-colors"
                  >
                    <Plus size={20} />
                    Create New Playlist
                  </button>
                )}

                <AnimatePresence>
                  {isCreating && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-[#2a2a2a] rounded-lg p-4 space-y-3"
                    >
                      <input
                        type="text"
                        placeholder="Playlist name"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        className="w-full bg-[#3a3a3a] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                      />
                      <input
                        type="text"
                        placeholder="Description (optional)"
                        value={newPlaylistDesc}
                        onChange={(e) => setNewPlaylistDesc(e.target.value)}
                        className="w-full bg-[#3a3a3a] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
                        onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleCreate}
                          disabled={!newPlaylistName.trim()}
                          className="flex-1 bg-[#FF9900] text-black py-2 rounded-lg hover:bg-[#FF6600] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Create
                        </button>
                        <button
                          onClick={() => {
                            setIsCreating(false);
                            setNewPlaylistName('');
                            setNewPlaylistDesc('');
                          }}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-2">
                  {playlists.map((playlist) => (
                    <PlaylistItem key={playlist.id} playlist={playlist} onDelete={deletePlaylist} />
                  ))}
                </div>

                {playlists.length === 0 && !isCreating && (
                  <div className="text-center py-8 text-gray-400">
                    <Music size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No playlists yet</p>
                    <p className="text-sm">Create your first playlist to get started!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function PlaylistItem({ playlist, onDelete }: { playlist: Playlist; onDelete: (id: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded-lg hover:bg-[#3a3a3a] transition-colors"
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-white truncate">{playlist.name}</h3>
        <p className="text-sm text-gray-400">
          {playlist.songIds.length} songs • {new Date(playlist.createdAt).toLocaleDateString()}
        </p>
        {playlist.description && (
          <p className="text-xs text-gray-500 truncate">{playlist.description}</p>
        )}
      </div>
      <button
        onClick={() => onDelete(playlist.id)}
        className="ml-2 p-2 text-gray-400 hover:text-red-400 transition-colors"
      >
        <Trash2 size={16} />
      </button>
    </motion.div>
  );
}
