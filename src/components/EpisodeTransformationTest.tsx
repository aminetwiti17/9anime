import React, { useState } from 'react';
import { episodeService } from '../services/episodeService';

interface EpisodeTransformationTestProps {
  animeId: string;
}

export const EpisodeTransformationTest: React.FC<EpisodeTransformationTestProps> = ({ animeId }) => {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runTransformationTest = async () => {
    setLoading(true);
    setError(null);
    setTestResults(null);
    
    try {
      console.log('🧪 Test de transformation pour:', animeId);
      
      // Test 1: Appel direct à l'API
      const apiUrl = `https://app.ty-dev.fr/anime/${animeId}/episodes`;
      console.log('📍 URL API testée:', apiUrl);
      
      const apiResponse = await fetch(apiUrl);
      const apiData = await apiResponse.json();
      
      // Test 2: Service transformé
      const serviceData = await episodeService.getAnimeEpisodes(animeId);
      
      // Résultats du test
      const results = {
        timestamp: new Date().toISOString(),
        animeId: animeId,
        apiTest: {
          url: apiUrl,
          status: apiResponse.status,
          ok: apiResponse.ok,
          data: apiData,
          success: apiData.success,
          episodeCount: apiData.data?.length || 0,
          hasAnimeInfo: !!apiData.anime_info
        },
        serviceTest: {
          success: !!serviceData,
          animeId: serviceData?.animeId,
          animeTitle: serviceData?.animeTitle,
          episodeCount: serviceData?.episodes?.length || 0,
          transformedData: serviceData
        },
        analysis: {
          apiWorking: apiResponse.ok && apiData.success,
          serviceWorking: !!serviceData,
          transformationSuccess: serviceData && serviceData.episodes && serviceData.episodes.length > 0,
          issues: []
        }
      };
      
      // Analyser les problèmes
      if (!apiResponse.ok) {
        results.analysis.issues.push(`API HTTP Error: ${apiResponse.status}`);
      }
      
      if (!apiData.success) {
        results.analysis.issues.push(`API Success: false - ${apiData.message}`);
      }
      
      if (apiData.data && apiData.data.length === 0) {
        results.analysis.issues.push('API retourne 0 épisode');
      }
      
      if (!serviceData) {
        results.analysis.issues.push('Service retourne null');
      }
      
      if (serviceData && serviceData.episodes && serviceData.episodes.length === 0) {
        results.analysis.issues.push('Transformation retourne 0 épisode');
      }
      
      setTestResults(results);
      console.log('📊 Résultats du test:', results);
      
    } catch (err: any) {
      setError(err.message);
      console.error('❌ Erreur dans le test:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dark-900 border border-gray-700 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-white">Test de Transformation des Épisodes</h3>
      
      <div className="text-sm text-gray-400">
        <p>Anime ID: <code className="bg-gray-800 px-2 py-1 rounded">{animeId}</code></p>
        <p>URL testée: <code className="bg-gray-800 px-2 py-1 rounded">https://app.ty-dev.fr/anime/{animeId}/episodes</code></p>
      </div>
      
      <button
        onClick={runTransformationTest}
        disabled={loading}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? 'Test en cours...' : 'Lancer le Test de Transformation'}
      </button>
      
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 p-3 rounded">
          ❌ Erreur: {error}
        </div>
      )}
      
      {testResults && (
        <div className="space-y-4">
          <h4 className="text-md font-medium text-white">📊 Résultats du Test</h4>
          
          {/* Résumé */}
          <div className="bg-dark-800 p-4 rounded">
            <h5 className="text-sm font-medium text-white mb-2">Résumé</h5>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p>✅ API fonctionne: {testResults.analysis.apiWorking ? 'OUI' : 'NON'}</p>
                <p>✅ Service fonctionne: {testResults.analysis.serviceWorking ? 'OUI' : 'NON'}</p>
                <p>✅ Transformation réussie: {testResults.analysis.transformationSuccess ? 'OUI' : 'NON'}</p>
              </div>
              <div>
                <p>📊 Épisodes API: {testResults.apiTest.episodeCount}</p>
                <p>📊 Épisodes transformés: {testResults.serviceTest.episodeCount}</p>
                <p>⚠️ Problèmes: {testResults.analysis.issues.length}</p>
              </div>
            </div>
          </div>
          
          {/* Problèmes identifiés */}
          {testResults.analysis.issues.length > 0 && (
            <div className="bg-yellow-900 border border-yellow-700 text-yellow-200 p-3 rounded">
              <h5 className="font-medium mb-2">⚠️ Problèmes Identifiés:</h5>
              <ul className="list-disc list-inside space-y-1">
                {testResults.analysis.issues.map((issue: string, index: number) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Détails API */}
          <div className="bg-dark-800 p-4 rounded">
            <h5 className="text-sm font-medium text-white mb-2">📡 Test API</h5>
            <div className="text-sm space-y-1">
              <p>Status: {testResults.apiTest.status}</p>
              <p>Success: {testResults.apiTest.success ? 'true' : 'false'}</p>
              <p>Épisodes: {testResults.apiTest.episodeCount}</p>
              <p>Info anime: {testResults.apiTest.hasAnimeInfo ? 'Présente' : 'Absente'}</p>
            </div>
          </div>
          
          {/* Détails Service */}
          <div className="bg-dark-800 p-4 rounded">
            <h5 className="text-sm font-medium text-white mb-2">🔄 Test Service</h5>
            <div className="text-sm space-y-1">
              <p>Success: {testResults.serviceTest.success ? 'true' : 'false'}</p>
              <p>Anime ID: {testResults.serviceTest.animeId || 'N/A'}</p>
              <p>Anime Title: {testResults.serviceTest.animeTitle || 'N/A'}</p>
              <p>Épisodes transformés: {testResults.serviceTest.episodeCount}</p>
            </div>
          </div>
          
          {/* Données brutes pour debug */}
          <details className="bg-dark-800 p-4 rounded">
            <summary className="text-sm font-medium text-white cursor-pointer">
              🔍 Données Brutes (Cliquer pour voir)
            </summary>
            <div className="mt-2 text-xs text-gray-300 overflow-auto max-h-40">
              <pre>{JSON.stringify(testResults, null, 2)}</pre>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};
