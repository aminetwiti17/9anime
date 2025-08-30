export interface Anime {
  id?: string;
  _id?: string;
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
  popularity_score?: number;
  total_episodes: number;
  episode_duration?: number;
  start_date?: string;
  end_date?: string;
  release_year?: number;
  studio?: Studio | string | null;
  season?: Season | string | null;
  genres: (Genre | string)[];
  source_material?: string;
  age_rating?: 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';
  is_featured?: boolean;
  is_trending?: boolean;
  view_count?: number;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Genre {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface Studio {
  id: string;
  name: string;
  description?: string;
  founded_year?: number;
  website?: string;
  logo_url?: string;
}

export interface Season {
  id: string;
  name: string;
  year: number;
  season_type: 'Spring' | 'Summer' | 'Fall' | 'Winter';
} 