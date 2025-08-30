// Configuration API pour AniStream Frontend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://app.ty-dev.fr';
const API_VERSION = 'v1';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/${API_VERSION}/auth/login`,
    REGISTER: `${API_BASE_URL}/api/${API_VERSION}/auth/register`,
    REFRESH: `${API_BASE_URL}/api/${API_VERSION}/auth/refresh`,
    LOGOUT: `${API_BASE_URL}/api/${API_VERSION}/auth/logout`,
  },

  // Anime
  ANIME: {
    LIST: `${API_BASE_URL}/api/${API_VERSION}/anime`,
    TRENDING: `${API_BASE_URL}/api/${API_VERSION}/anime/trending`,
    FEATURED: `${API_BASE_URL}/api/${API_VERSION}/anime/featured`,
    BY_SLUG: (slug: string) => `${API_BASE_URL}/api/${API_VERSION}/anime/slug/${slug}`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/${API_VERSION}/anime/id/${id}`,
    BY_IDENTIFIER: (identifier: string) => `${API_BASE_URL}/api/${API_VERSION}/anime/${identifier}`,
  },

  // Episodes
  EPISODES: {
    LIST: `${API_BASE_URL}/api/${API_VERSION}/episodes`,
    BY_ID: (id: string) => `${API_BASE_URL}/api/${API_VERSION}/episodes/${id}`,
    BY_ANIME: (animeId: string) => `${API_BASE_URL}/api/${API_VERSION}/anime/${animeId}/episodes`,
    LATEST: `${API_BASE_URL}/api/${API_VERSION}/episodes?sort=air_date&order=desc`,
  },

  // Search
  SEARCH: {
    ANIME: `${API_BASE_URL}/api/${API_VERSION}/search`,
    SUGGESTIONS: `${API_BASE_URL}/api/${API_VERSION}/search/suggestions`,
    BY_SLUG: (slug: string) => `${API_BASE_URL}/api/${API_VERSION}/search/slug/${slug}`,
    SLUG_SUGGESTIONS: `${API_BASE_URL}/api/${API_VERSION}/search/slug-suggestions`,
    GENERATE_SLUG: `${API_BASE_URL}/api/${API_VERSION}/search/generate-slug`,
  },

  // Users
  USERS: {
    PROFILE: `${API_BASE_URL}/api/${API_VERSION}/users/profile`,
    WATCHLIST: `${API_BASE_URL}/api/${API_VERSION}/users/watchlist`,
    HISTORY: `${API_BASE_URL}/api/${API_VERSION}/users/history`,
  },

  // Genres
  GENRES: {
    LIST: `${API_BASE_URL}/api/${API_VERSION}/genres`,
  },

  // Studios
  STUDIOS: {
    LIST: `${API_BASE_URL}/api/${API_VERSION}/studios`,
  },
};

// Configuration des headers par défaut
export const getDefaultHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Fonction utilitaire pour les requêtes API
export const apiRequest = async (
  url: string,
  options: RequestInit = {}
) => {
  const config: RequestInit = {
    headers: getDefaultHeaders(),
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// Types pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface Anime {
  _id: string;
  title: string;
  english_title?: string;
  japanese_title?: string;
  slug: string;
  description?: string;
  synopsis?: string;
  poster_url?: string;
  banner_url?: string;
  anime_type: 'TV' | 'Movie' | 'OVA' | 'ONA' | 'Special' | 'Music';
  status: 'ongoing' | 'completed' | 'upcoming' | 'hiatus';
  rating: number;
  popularity_score: number;
  total_episodes: number;
  episode_duration: number;
  start_date?: string;
  end_date?: string;
  release_year?: number;
  studio?: { _id: string; name: string };
  season?: { _id: string; name: string; year: number; season_type: string };
  source_material?: string;
  age_rating: string;
  is_featured: boolean;
  is_trending: boolean;
  view_count: number;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  genres: { _id: string; name: string; color: string }[];
  created_at: string;
  updated_at: string;
}

export interface Episode {
  _id: string;
  anime: string | Anime;
  episode_number: number;
  title?: string;
  description?: string;
  thumbnail_url?: string;
  duration: number;
  air_date?: string;
  is_filler: boolean;
  is_recap: boolean;
  is_available: boolean;
  subtitle_type: 'SUB' | 'DUB' | 'RAW';
  view_count: number;
  video_sources: VideoSource[];
  created_at: string;
  updated_at: string;
}

export interface VideoSource {
  _id?: string;
  server_name: string;
  server_location?: string;
  quality: '360p' | '480p' | '720p' | '1080p' | '4K';
  subtitle_type: 'SUB' | 'DUB' | 'RAW';
  video_url: string;
  embed_url?: string;
  file_size?: number;
  is_active: boolean;
  priority: number;
  avg_load_time?: number;
  uptime_percentage?: number;
}

export interface User {
  _id: string;
  email: string;
  username: string;
  avatar_url?: string;
  role: 'user' | 'moderator' | 'admin';
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Genre {
  _id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
}

export interface Studio {
  _id: string;
  name: string;
  description?: string;
  founded_year?: number;
  website?: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
} 