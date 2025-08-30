// Service de recherche avancée avec support des slugs
import { API_ROUTES, apiRequest, apiRequestWithRetry } from '../config/apiRoutes';

export interface SearchFilters {
  q?: string;
  slug?: string;
  genre?: string;
  year?: number;
  type?: string;
  status?: string;
  sort?: 'relevance' | 'title' | 'year' | 'rating' | 'popularity' | 'views' | 'slug';
  page?: number;
  limit?: number;
}

export interface SearchSuggestion {
  id: string;
  title: string;
  slug: string;
  poster_url?: string;
  rating?: number;
  release_year?: number;
}

export const searchService = {
  // Recherche avancée d'anime avec tous les filtres
  async searchAnime(filters: SearchFilters) {
    try {
      const params = new URLSearchParams();
      
      if (filters.q) params.append('q', filters.q);
      if (filters.slug) params.append('slug', filters.slug);
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.year) params.append('year', filters.year.toString());
      if (filters.type) params.append('type', filters.type);
      if (filters.status) params.append('status', filters.status);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());

      const url = `${API_ROUTES.SEARCH.ANIME}?${params.toString()}`;
      const response = await apiRequest(url);
      return response;
    } catch (error) {
      console.error('Error searching anime:', error);
      throw error;
    }
  },

  // Recherche par slug exact
  async searchBySlug(slug: string) {
    try {
      const response = await apiRequest(API_ROUTES.SEARCH.BY_SLUG(slug));
      return response;
    } catch (error) {
      console.error('Error searching by slug:', error);
      throw error;
    }
  },

  // Suggestions de recherche (titre, slug, etc.)
  async getSuggestions(query: string, type: 'all' | 'title' | 'slug' = 'all') {
    try {
      const params = new URLSearchParams({ q: query, type });
      const url = `${API_ROUTES.SEARCH.SUGGESTIONS}?${params.toString()}`;
      const response = await apiRequest(url);
      return response;
    } catch (error) {
      console.error('Error getting suggestions:', error);
      throw error;
    }
  },

  // Suggestions de slug pour l'autocomplétion
  async getSlugSuggestions(query: string, limit: number = 5) {
    try {
      const params = new URLSearchParams({ q: query, limit: limit.toString() });
      const url = `${API_ROUTES.SEARCH.SLUG_SUGGESTIONS}?${params.toString()}`;
      const response = await apiRequest(url);
      return response;
    } catch (error) {
      console.error('Error getting slug suggestions:', error);
      throw error;
    }
  },

  // Génération automatique de slug
  async generateSlug(title: string) {
    try {
      const params = new URLSearchParams({ title });
      const url = `${API_ROUTES.SEARCH.GENERATE_SLUG}?${params.toString()}`;
      const response = await apiRequest(url);
      return response;
    } catch (error) {
      console.error('Error generating slug:', error);
      throw error;
    }
  },

  // Recherche rapide par slug (pour la navigation)
  async quickSlugSearch(slug: string) {
    try {
      // D'abord essayer la recherche exacte par slug
      const exactMatch = await this.searchBySlug(slug);
      if (exactMatch.success) {
        return exactMatch;
      }

      // Si pas de match exact, essayer une recherche partielle
      const partialMatch = await this.searchAnime({ 
        slug: `${slug}*`, 
        limit: 1 
      });
      
      if (partialMatch.success && partialMatch.data.length > 0) {
        return {
          success: true,
          message: 'Partial match found',
          data: partialMatch.data[0]
        };
      }

      return {
        success: false,
        message: 'No anime found with this slug'
      };
    } catch (error) {
      console.error('Error in quick slug search:', error);
      throw error;
    }
  }
};
