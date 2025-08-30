import { useState, useEffect } from 'react';
import { EpisodeData, AnimeEpisodeData } from '../types/episode';
import { episodeService } from '../services/episodeService';

export const useEpisode = (animeId: string, episodeNumber: number) => {
  const [episode, setEpisode] = useState<EpisodeData | null>(null);
  const [animeTitle, setAnimeTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEpisode = async () => {
      if (!animeId || !episodeNumber) return;
      
      setLoading(true);
      setError(null);

      try {
        const [episodeData, title] = await Promise.all([
          episodeService.getEpisodeData(animeId, episodeNumber),
          episodeService.getAnimeTitle(animeId)
        ]);

        if (!episodeData) {
          setError('Episode not found');
          return;
        }

        setEpisode(episodeData);
        setAnimeTitle(title || 'Unknown Anime');
      } catch (err) {
        setError('Failed to load episode data');
        console.error('Episode fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEpisode();
  }, [animeId, episodeNumber]);

  return { episode, animeTitle, loading, error };
};

export const useAnimeEpisodes = (animeId: string) => {
  const [animeData, setAnimeData] = useState<AnimeEpisodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnimeEpisodes = async () => {
      if (!animeId) return;
      
      setLoading(true);
      setError(null);

      try {
        const data = await episodeService.getAnimeEpisodes(animeId);
        
        if (!data) {
          setError('Anime not found');
          return;
        }

        setAnimeData(data);
      } catch (err) {
        setError('Failed to load anime episodes');
        console.error('Anime episodes fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnimeEpisodes();
  }, [animeId]);

  return { animeData, loading, error };
};