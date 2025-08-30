import { useState, useEffect } from 'react';
import { Anime, Genre } from '../types/anime';
import { API_ROUTES, apiRequest, apiRequestWithRetry } from '../config/apiRoutes';

export const useTrendingAnime = (limit = 10) => {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrendingAnime = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiRequest(`${API_ROUTES.ANIME.TRENDING}?limit=${limit}`);
        setAnime(res.data || []);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des animés tendance');
      } finally {
        setLoading(false);
      }
    };
    fetchTrendingAnime();
  }, [limit]);

  return { anime, loading, error };
};

export const usePopularAnime = (limit = 20) => {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularAnime = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiRequest(`${API_ROUTES.ANIME.LIST}?sort=popularity_score&order=desc&limit=${limit}`);
        setAnime(res.data || []);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des animés populaires');
      } finally {
        setLoading(false);
      }
    };
    fetchPopularAnime();
  }, [limit]);

  return { anime, loading, error };
};

export const useLatestEpisodes = (limit = 20) => {
  const [episodes, setEpisodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestEpisodes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiRequest(`${API_ROUTES.EPISODES.LATEST}?limit=${limit}`);
        setEpisodes(res.data || []);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des derniers épisodes');
      } finally {
        setLoading(false);
      }
    };
    fetchLatestEpisodes();
  }, [limit]);

  return { episodes, loading, error };
};

export const useAnimeBySlug = (slug: string) => {
  const [anime, setAnime] = useState<Anime | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiRequest(API_ROUTES.ANIME.BY_SLUG(slug));
        setAnime(res.data || null);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement de l’anime');
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchAnime();
  }, [slug]);

  return { anime, loading, error };
};

export const useGenres = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiRequest(API_ROUTES.GENRES.LIST);
        setGenres(res.data || []);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des genres');
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  return { genres, loading, error };
};

export const useUpcomingAnime = (limit = 10) => {
  const [anime, setAnime] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingAnime = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiRequest(`${API_ROUTES.ANIME.LIST}?status=upcoming&sort=start_date&order=asc&limit=${limit}`);
        setAnime(res.data || []);
      } catch (err: any) {
        setError(err.message || 'Erreur lors du chargement des anime à venir');
      } finally {
        setLoading(false);
      }
    };
    fetchUpcomingAnime();
  }, [limit]);

  return { anime, loading, error };
};

// Hook pour incrémenter le nombre de vues
export const useIncrementViewCount = () => {
  const incrementViewCount = async (targetType: 'anime' | 'episode', targetId: string) => {
    try {
      // Pour le moment, juste un log
      // Incrementing view count
    } catch (err) {
      console.error('Erreur lors de l\'incrémentation des vues:', err);
    }
  };

  return { incrementViewCount };
};