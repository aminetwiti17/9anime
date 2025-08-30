export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  role: 'user' | 'moderator' | 'admin';
  is_active: boolean;
  email_verified: boolean;
  watchlist: string[]; // Array of Anime IDs
  watch_history: WatchHistory[];
  preferences?: UserPreferences;
  stats?: UserStats;
  created_at?: string;
  updated_at?: string;
}

export interface WatchHistory {
  anime: string; // Anime ID
  episode: string; // Episode ID
  progress: number;
  completed: boolean;
  watched_at: string;
}

export interface UserPreferences {
  subtitle_type: 'SUB' | 'DUB' | 'RAW';
  quality: '360p' | '480p' | '720p' | '1080p' | '4K';
  auto_play: boolean;
  auto_next: boolean;
}

export interface UserStats {
  total_watch_time: number;
  anime_completed: number;
  episodes_watched: number;
} 