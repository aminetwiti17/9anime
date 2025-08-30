import { useState, useEffect, useCallback } from 'react';
import { searchService, SearchFilters, SearchSuggestion } from '../services/searchService';

export const useSearch = () => {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Recherche avancée
  const searchAnime = useCallback(async (filters: SearchFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchService.searchAnime(filters);
      if (response.success) {
        setSearchResults(response.data || []);
        setTotalResults(response.pagination?.total || 0);
        setCurrentPage(response.pagination?.current_page || 1);
      } else {
        setError(response.message || 'Erreur lors de la recherche');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  }, []);

  // Recherche par slug
  const searchBySlug = useCallback(async (slug: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchService.searchBySlug(slug);
      if (response.success) {
        setSearchResults([response.data]);
        setTotalResults(1);
        setCurrentPage(1);
      } else {
        setError(response.message || 'Anime non trouvé');
        setSearchResults([]);
        setTotalResults(0);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la recherche par slug');
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Suggestions de recherche
  const getSuggestions = useCallback(async (query: string, type: 'all' | 'title' | 'slug' = 'all') => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await searchService.getSuggestions(query, type);
      if (response.success) {
        setSuggestions(response.data || []);
      }
    } catch (err) {
      console.error('Error getting suggestions:', err);
      setSuggestions([]);
    }
  }, []);

  // Suggestions de slug
  const getSlugSuggestions = useCallback(async (query: string, limit: number = 5) => {
    if (!query || query.length < 1) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await searchService.getSlugSuggestions(query, limit);
      if (response.success) {
        setSuggestions(response.data || []);
      }
    } catch (err) {
      console.error('Error getting slug suggestions:', err);
      setSuggestions([]);
    }
  }, []);

  // Recherche rapide par slug
  const quickSlugSearch = useCallback(async (slug: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await searchService.quickSlugSearch(slug);
      if (response.success) {
        setSearchResults([response.data]);
        setTotalResults(1);
        setCurrentPage(1);
      } else {
        setError(response.message || 'Aucun anime trouvé avec ce slug');
        setSearchResults([]);
        setTotalResults(0);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la recherche rapide');
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, []);

  // Recherche simple par texte
  const searchByText = useCallback(async (query: string, page: number = 1) => {
    await searchAnime({
      q: query,
      page,
      limit: 20,
      sort: 'relevance'
    });
  }, [searchAnime]);

  // Recherche par genre
  const searchByGenre = useCallback(async (genre: string, page: number = 1) => {
    await searchAnime({
      genre,
      page,
      limit: 20,
      sort: 'popularity'
    });
  }, [searchAnime]);

  // Recherche par année
  const searchByYear = useCallback(async (year: number, page: number = 1) => {
    await searchAnime({
      year,
      page,
      limit: 20,
      sort: 'year'
    });
  }, [searchAnime]);

  // Recherche par type
  const searchByType = useCallback(async (type: string, page: number = 1) => {
    await searchAnime({
      type,
      page,
      limit: 20,
      sort: 'popularity'
    });
  }, [searchAnime]);

  // Recherche par statut
  const searchByStatus = useCallback(async (status: string, page: number = 1) => {
    await searchAnime({
      status,
      page,
      limit: 20,
      sort: 'popularity'
    });
  }, [searchAnime]);

  // Recherche par slug partiel
  const searchByPartialSlug = useCallback(async (partialSlug: string, page: number = 1) => {
    await searchAnime({
      slug: `${partialSlug}*`,
      page,
      limit: 20,
      sort: 'slug'
    });
  }, [searchAnime]);

  // Réinitialiser les résultats
  const clearResults = useCallback(() => {
    setSearchResults([]);
    setSuggestions([]);
    setError(null);
    setTotalResults(0);
    setCurrentPage(1);
  }, []);

  // Charger la page suivante
  const loadNextPage = useCallback(async (filters: SearchFilters) => {
    const nextPage = currentPage + 1;
    await searchAnime({
      ...filters,
      page: nextPage
    });
  }, [currentPage, searchAnime]);

  // Charger la page précédente
  const loadPreviousPage = useCallback(async (filters: SearchFilters) => {
    const prevPage = Math.max(1, currentPage - 1);
    await searchAnime({
      ...filters,
      page: prevPage
    });
  }, [currentPage, searchAnime]);

  return {
    // État
    searchResults,
    suggestions,
    loading,
    error,
    totalResults,
    currentPage,
    
    // Actions de recherche
    searchAnime,
    searchBySlug,
    searchByText,
    searchByGenre,
    searchByYear,
    searchByType,
    searchByStatus,
    searchByPartialSlug,
    quickSlugSearch,
    
    // Suggestions
    getSuggestions,
    getSlugSuggestions,
    
    // Navigation
    loadNextPage,
    loadPreviousPage,
    
    // Utilitaires
    clearResults
  };
};
