// Service d'accès aux épisodes via l'API REST
import { BACKEND_API_ROUTES, apiRequest, apiRequestWithRetry } from '../config/apiRoutes';

export const episodeService = {
  // Récupérer les données d'un épisode par animeId et numéro d'épisode
  async getEpisodeData(animeId: string, episodeNumber: number) {
    try {
      // Utiliser la nouvelle route backend
      const url = BACKEND_API_ROUTES.EPISODES.BY_ANIME_EPISODE(animeId, episodeNumber);
      console.log('🔍 Appel API backend pour épisode:', animeId, episodeNumber);
      console.log('📍 URL:', url);
      
      const data = await apiRequest(url);
      console.log('📡 Réponse API backend:', data);
      
      if (data.success && data.data) {
        return data.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching episode data:', error);
      return null;
    }
  },

  // Récupérer tous les épisodes d'un anime
  async getAnimeEpisodes(animeId: string) {
    try {
      // Utiliser la nouvelle route backend - essayer d'abord par slug, puis par ID
      let url = BACKEND_API_ROUTES.EPISODES.BY_ANIME_SLUG(animeId);
      console.log('🔍 Appel API backend pour anime:', animeId);
      console.log('📍 URL (slug):', url);
      
      let response = await apiRequest(url);
      
      // Si pas trouvé par slug, essayer par ID
      if (!response.success && response.message?.includes('not found')) {
        console.log('🔄 Slug non trouvé, essai par ID...');
        url = BACKEND_API_ROUTES.EPISODES.BY_ANIME_ID(animeId);
        console.log('📍 URL (ID):', url);
        response = await apiRequest(url);
      }
      
      console.log('📡 Réponse API backend:', response);
      
      if (!response.success) {
        console.log('❌ API retourne success: false');
        console.log('💬 Message:', response.message);
        return null;
      }
      
      if (!response.data || !Array.isArray(response.data)) {
        console.log('❌ Pas de données ou format invalide');
        console.log('📊 Type de data:', typeof response.data);
        console.log('📋 Data:', response.data);
        return null;
      }

      // Transformer la réponse API en format attendu par le frontend
      const transformedData = {
        animeId: animeId,
        animeTitle: response.anime_info?.title || 'Unknown Anime',
        episodes: response.data.map((episode: any) => ({
          id: episode._id,
          number: episode.episode_number,
          title: episode.title,
          description: episode.description,
          thumbnail: episode.thumbnail_url,
          airDate: episode.air_date,
          status: episode.is_available ? 'available' : 'unavailable',
          sources: episode.video_sources?.map((source: any) => ({
            url: source.video_url,
            quality: source.quality,
            server: source.server_name
          })) || []
        }))
      };

      console.log('🔄 Données transformées:', transformedData);
      console.log('📊 Nombre d\'épisodes transformés:', transformedData.episodes.length);
      return transformedData;
    } catch (error) {
      console.error('❌ Error fetching anime episodes:', error);
      console.error('🔍 Détails de l\'erreur:', {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace',
        animeId: animeId
      });
      return null;
    }
  },

  // Récupérer le titre d'un anime par son ID ou slug
  async getAnimeTitle(animeId: string) {
    try {
      // Utiliser la nouvelle route backend - essayer d'abord par slug, puis par ID
      let url = BACKEND_API_ROUTES.ANIME.BY_SLUG(animeId);
      console.log('🔍 Appel API backend pour titre anime:', animeId);
      console.log('📍 URL (slug):', url);
      
      let data = await apiRequest(url);
      
      // Si pas trouvé par slug, essayer par ID
      if (!data.success && data.message?.includes('not found')) {
        console.log('🔄 Slug non trouvé, essai par ID...');
        url = BACKEND_API_ROUTES.ANIME.BY_ID(animeId);
        console.log('📍 URL (ID):', url);
        data = await apiRequest(url);
      }
      
      if (data.success && data.data) {
        return data.data.title || null;
      }
      return null;
    } catch (error) {
      console.error('Error fetching anime title:', error);
      return null;
    }
  },

  // Version avec retry automatique pour les requêtes critiques
  async getAnimeEpisodesWithRetry(animeId: string) {
    try {
      // Utiliser la nouvelle route backend avec retry
      let url = BACKEND_API_ROUTES.EPISODES.BY_ANIME_SLUG(animeId);
      let data = await apiRequestWithRetry(url);
      
      // Si pas trouvé par slug, essayer par ID
      if (!data.success && data.message?.includes('not found')) {
        url = BACKEND_API_ROUTES.EPISODES.BY_ANIME_ID(animeId);
        data = await apiRequestWithRetry(url);
      }
      
      return data.data || null;
    } catch (error) {
      console.error('Error fetching anime episodes with retry:', error);
      return null;
    }
  }
};