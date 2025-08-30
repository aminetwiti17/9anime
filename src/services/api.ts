import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Types
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

export interface User {
  _id: string;
  email: string;
  username: string;
  avatar_url?: string;
  role: 'user' | 'moderator' | 'admin';
  is_active: boolean;
  email_verified: boolean;
  watchlist: string[];
  watch_history: Array<{
    anime: string;
    episode: string;
    progress: number;
    completed: boolean;
    watched_at: string;
  }>;
  preferences: {
    subtitle_type: 'SUB' | 'DUB' | 'RAW';
    quality: '360p' | '480p' | '720p' | '1080p' | '4K';
    auto_play: boolean;
    auto_next: boolean;
  };
  stats: {
    total_watch_time: number;
    anime_completed: number;
    episodes_watched: number;
  };
  createdAt: string;
  updatedAt: string;
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
  studio?: {
    _id: string;
    name: string;
    country: string;
  };
  season?: {
    _id: string;
    name: string;
    year: number;
    season_type: string;
  };
  genres: Array<{
    _id: string;
    name: string;
    color: string;
  }>;
  source_material?: string;
  age_rating: 'G' | 'PG' | 'PG-13' | 'R' | 'R+' | 'NC-17';
  is_featured: boolean;
  is_trending: boolean;
  view_count: number;
  meta_title?: string;
  meta_description?: string;
  keywords: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Episode {
  _id: string;
  anime: string | Anime;
  episode_number: number;
  title?: string;
  description?: string;
  duration: number;
  thumbnail_url?: string;
  video_urls: Array<{
    quality: '360p' | '480p' | '720p' | '1080p' | '4K';
    url: string;
    server: string;
  }>;
  subtitle_urls: Array<{
    language: string;
    url: string;
    type: 'SUB' | 'DUB';
  }>;
  is_premium: boolean;
  view_count: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface SearchFilters {
  q?: string;
  genre?: string;
  year?: number;
  type?: string;
  status?: string;
  sort?: 'relevance' | 'title' | 'year' | 'rating' | 'popularity';
  page?: number;
  limit?: number;
}

// API Service Class
class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.api.post('/auth/register', data);
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await this.api.post('/auth/refresh');
    return response.data;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.api.post('/auth/logout');
    return response.data;
  }

  // User endpoints
  async getProfile(): Promise<ApiResponse<User>> {
    const response = await this.api.get('/users/profile');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await this.api.put('/users/profile', data);
    return response.data;
  }

  async getWatchlist(): Promise<ApiResponse<Anime[]>> {
    const response = await this.api.get('/users/watchlist');
    return response.data;
  }

  async addToWatchlist(animeId: string): Promise<ApiResponse> {
    const response = await this.api.post(`/anime/${animeId}/watchlist`);
    return response.data;
  }

  async removeFromWatchlist(animeId: string): Promise<ApiResponse> {
    const response = await this.api.delete(`/anime/${animeId}/watchlist`);
    return response.data;
  }

  // Anime endpoints
  async getAnimeList(filters?: SearchFilters): Promise<ApiResponse<Anime[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    const response = await this.api.get(`/anime?${params.toString()}`);
    return response.data;
  }

  async getAnimeById(id: string): Promise<ApiResponse<Anime>> {
    const response = await this.api.get(`/anime/${id}`);
    return response.data;
  }

  async getAnimeBySlug(slug: string): Promise<ApiResponse<Anime>> {
    const response = await this.api.get(`/anime/slug/${slug}`);
    return response.data;
  }

  async getTrendingAnime(limit: number = 10): Promise<ApiResponse<Anime[]>> {
    const response = await this.api.get(`/anime/trending?limit=${limit}`);
    return response.data;
  }

  async getFeaturedAnime(limit: number = 10): Promise<ApiResponse<Anime[]>> {
    const response = await this.api.get(`/anime/featured?limit=${limit}`);
    return response.data;
  }

  // Episode endpoints
  async getEpisodesByAnime(animeId: string): Promise<ApiResponse<Episode[]>> {
    // Utiliser la nouvelle route backend - essayer d'abord par slug, puis par ID
    let response;
    try {
      response = await this.api.get(`/api/v1/episodes/anime/slug/${animeId}`);
    } catch (error) {
      // Si pas trouvé par slug, essayer par ID
      response = await this.api.get(`/api/v1/episodes/anime/${animeId}`);
    }
    return response.data;
  }

  async getEpisodeById(id: string): Promise<ApiResponse<Episode>> {
    const response = await this.api.get(`/episodes/${id}`);
    return response.data;
  }

  // Search endpoints
  async searchAnime(filters: SearchFilters): Promise<ApiResponse<Anime[]>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
    
    const response = await this.api.get(`/search?${params.toString()}`);
    return response.data;
  }

  // Genre and Studio endpoints
  async getGenres(): Promise<ApiResponse<Array<{ _id: string; name: string; color: string }>>> {
    const response = await this.api.get('/genres');
    return response.data;
  }

  async getStudios(): Promise<ApiResponse<Array<{ _id: string; name: string; country: string }>>> {
    const response = await this.api.get('/studios');
    return response.data;
  }

  // Utility methods
  setAuthToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  removeAuthToken() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
