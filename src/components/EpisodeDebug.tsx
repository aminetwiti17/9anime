import React, { useState } from 'react';
import { episodeService } from '../services/episodeService';

interface EpisodeDebugProps {
  animeId: string;
}

export const EpisodeDebug: React.FC<EpisodeDebugProps> = ({ animeId }) => {
  const [rawData, setRawData] = useState<any>(null);
  const [transformedData, setTransformedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testEpisodeService = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🧪 Test du service d\'épisodes pour:', animeId);
      
      // Test 1: Appel direct à l'API
      const url = `https://app.ty-dev.fr/anime/${animeId}/episodes`;
      console.log('📍 URL testée:', url);
      
      const response = await fetch(url);
      const rawResponse = await response.json();
      setRawData(rawResponse);
      console.log('📡 Réponse brute de l\'API:', rawResponse);
      
      // Test 2: Service transformé
      const serviceData = await episodeService.getAnimeEpisodes(animeId);
      setTransformedData(serviceData);
      console.log('🔄 Données transformées par le service:', serviceData);
      
    } catch (err: any) {
      setError(err.message);
      console.error('❌ Erreur dans le test:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-900 border border-gray-700 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white">Debug des Épisodes</h3>
      
      <button
        onClick={testEpisodeService}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? 'Test en cours...' : 'Tester le Service d\'Épisodes'}
      </button>
      
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 p-3 rounded">
          ❌ Erreur: {error}
        </div>
      )}
      
      {rawData && (
        <div className="space-y-2">
          <h4 className="text-md font-medium text-white">📡 Réponse Brute de l'API</h4>
          <div className="bg-dark-800 p-3 rounded text-xs text-gray-300 overflow-auto max-h-40">
            <pre>{JSON.stringify(rawData, null, 2)}</pre>
          </div>
        </div>
      )}
      
      {transformedData && (
        <div className="space-y-2">
          <h4 className="text-md font-medium text-white">🔄 Données Transformées</h4>
          <div className="bg-dark-800 p-3 rounded text-xs text-gray-300 overflow-auto max-h-40">
            <pre>{JSON.stringify(transformedData, null, 2)}</pre>
          </div>
          
          <div className="text-sm text-gray-400">
            <p>✅ Épisodes trouvés: {transformedData.episodes?.length || 0}</p>
            <p>✅ Titre de l'anime: {transformedData.animeTitle}</p>
            <p>✅ ID de l'anime: {transformedData.animeId}</p>
          </div>
        </div>
      )}
      
      <div className="text-xs text-gray-500">
        <p>Anime ID testé: {animeId}</p>
        <p>URL testée: https://app.ty-dev.fr/anime/{animeId}/episodes</p>
      </div>
    </div>
  );
};
