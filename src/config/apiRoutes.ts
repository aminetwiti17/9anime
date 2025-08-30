// Configuration centralisée des routes API pour AniStream Frontend
// Ce fichier contient toutes les routes disponibles dans le backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://app.ty-dev.fr';
const API_VERSION = 'v1';

// Routes directes (frontend) - Compatibles avec le backend
export const DIRECT_ROUTES = {
  // Anime episodes - Accepte ID et slug
  ANIME_EPISODES: (identifier: string) => `${API_BASE_URL}/anime/${identifier}/episodes`,
  
  // Anime info - Accepte ID et slug
  ANIME_INFO: (identifier: string) => `${API_BASE_URL}/anime/${identifier}`,
  
  // Health check
  HEALTH: `${API_BASE_URL}/health`,
  
  // API documentation
  API_DOCS: `${API_BASE_URL}/api-docs`,
};

// Routes API (backend) - Versionnées
export const API_ROUTES = {
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
    BY_ANIME_ID: (animeId: string) => `${API_BASE_URL}/api/${API_VERSION}/episodes/anime/${animeId}`,
    BY_ANIME_SLUG: (slug: string) => `${API_BASE_URL}/api/${API_VERSION}/episodes/anime/slug/${slug}`,
    BY_ANIME_EPISODE: (animeId: string, episodeNumber: number) => `${API_BASE_URL}/api/${API_VERSION}/episodes/anime/${animeId}/episode/${episodeNumber}`,
    LATEST: `${API_BASE_URL}/api/${API_VERSION}/episodes/latest`,
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

// Routes API Backend (versionnées) - Alias pour compatibilité
export const BACKEND_API_ROUTES = API_ROUTES;

// Configuration des headers par défaut
export const getDefaultHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Fonction utilitaire pour les requêtes API avec gestion d'erreur améliorée
export const apiRequest = async (
  url: string,
  options: RequestInit = {}
) => {
  const config: RequestInit = {
    headers: getDefaultHeaders(),
    ...options,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('API Request timeout:', url);
        throw new Error('Request timeout - please try again');
      }
      console.error('API Request failed:', error.message);
      throw error;
    }
    console.error('API Request failed:', error);
    throw new Error('An unexpected error occurred');
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

// Configuration des timeouts et retry
export const API_CONFIG = {
  TIMEOUT: 10000, // 10 secondes
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 seconde
};

// Fonction de retry automatique
export const apiRequestWithRetry = async (
  url: string,
  options: RequestInit = {},
  maxRetries: number = API_CONFIG.MAX_RETRIES
) => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiRequest(url, options);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Attendre avant de réessayer
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY * attempt));
      console.log(`Retry attempt ${attempt + 1} for ${url}`);
    }
  }
  
  throw lastError!;
};
