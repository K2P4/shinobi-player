export interface Playlist {
  id: string;
  name: string;
  description?: string;
  songIds: number[];
  createdAt: Date;
}
