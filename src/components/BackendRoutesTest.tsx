import React, { useState } from 'react';

interface TestResult {
  route: string;
  success: boolean;
  data?: any;
  error?: string;
  timestamp: string;
}

export const BackendRoutesTest: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [testSlug] = useState('demon-slayer-kimetsu-no-yaiba-hashira-training-arc-dub');
  const [testId] = useState('68af989a7ae01b4811dc2356');

  const runBackendRouteTest = async (route: string, url: string) => {
    try {
      console.log(`🧪 Test de la route: ${route}`);
      console.log(`📍 URL: ${url}`);
      
      const response = await fetch(url);
      const data = await response.json();
      
      const result: TestResult = {
        route,
        success: response.ok && data.success,
        data: data,
        timestamp: new Date().toLocaleTimeString()
      };
      
      if (!response.ok || !data.success) {
        result.error = data.message || `HTTP ${response.status}`;
      }
      
      console.log(`📡 Résultat:`, result);
      return result;
      
    } catch (error: any) {
      const result: TestResult = {
        route,
        success: false,
        error: error.message,
        timestamp: new Date().toLocaleTimeString()
      };
      
      console.error(`❌ Erreur pour ${route}:`, error);
      return result;
    }
  };

  const testAllBackendRoutes = async () => {
    setLoading(true);
    setTestResults([]);
    
    const results: TestResult[] = [];
    
    // Test 1: Episodes latest
    results.push(await runBackendRouteTest(
      'GET /api/v1/episodes/latest',
      'https://app.ty-dev.fr/api/v1/episodes/latest'
    ));
    
    // Test 2: Episodes search
    results.push(await runBackendRouteTest(
      'GET /api/v1/episodes/search?q=demon',
      'https://app.ty-dev.fr/api/v1/episodes/search?q=demon'
    ));
    
    // Test 3: Episodes par slug d'anime
    results.push(await runBackendRouteTest(
      'GET /api/v1/episodes/anime/slug/:slug',
      `https://app.ty-dev.fr/api/v1/episodes/anime/slug/${testSlug}`
    ));
    
    // Test 4: Episodes par ID d'anime
    results.push(await runBackendRouteTest(
      'GET /api/v1/episodes/anime/:animeId',
      `https://app.ty-dev.fr/api/v1/episodes/anime/${testId}`
    ));
    
    // Test 5: Épisode spécifique
    results.push(await runBackendRouteTest(
      'GET /api/v1/episodes/anime/:animeId/episode/:episodeNumber',
      `https://app.ty-dev.fr/api/v1/episodes/anime/${testSlug}/episode/1`
    ));
    
    // Test 6: Tous les épisodes avec filtres
    results.push(await runBackendRouteTest(
      'GET /api/v1/episodes (avec filtres)',
      'https://app.ty-dev.fr/api/v1/episodes?limit=5&sort=air_date&order=desc'
    ));
    
    // Test 7: Anime par slug
    results.push(await runBackendRouteTest(
      'GET /api/v1/anime/slug/:slug',
      `https://app.ty-dev.fr/api/v1/anime/slug/${testSlug}`
    ));
    
    // Test 8: Anime par ID
    results.push(await runBackendRouteTest(
      'GET /api/v1/anime/id/:id',
      `https://app.ty-dev.fr/api/v1/anime/id/${testId}`
    ));
    
    setTestResults(results);
    setLoading(false);
    
    console.log('🎯 Tous les tests terminés:', results);
  };

  const testDirectRoute = async () => {
    setLoading(true);
    
    const result = await runBackendRouteTest(
      'GET /anime/:slug/episodes (route directe)',
      `https://app.ty-dev.fr/anime/${testSlug}/episodes`
    );
    
    setTestResults([result]);
    setLoading(false);
  };

  const getStatusIcon = (success: boolean) => success ? '✅' : '❌';
  const getStatusColor = (success: boolean) => success ? 'text-green-500' : 'text-red-500';

  return (
    <div className="bg-dark-900 border border-gray-700 rounded-lg p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          🧪 Test des Routes Backend
        </h2>
        <p className="text-gray-400">
          Validation de la migration vers les routes API backend
        </p>
      </div>

      <div className="flex space-x-4 justify-center">
        <button
          onClick={testAllBackendRoutes}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          {loading ? '🔄 Test en cours...' : '🚀 Tester Routes Backend'}
        </button>
        
        <button
          onClick={testDirectRoute}
          disabled={loading}
          className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          🔍 Tester Route Directe
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">
            📊 Résultats des Tests
          </h3>
          
          <div className="grid gap-4">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${
                  result.success ? 'border-green-600 bg-green-900/20' : 'border-red-600 bg-red-900/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm text-gray-300">
                    {result.route}
                  </span>
                  <span className={`text-lg ${getStatusColor(result.success)}`}>
                    {getStatusIcon(result.success)}
                  </span>
                </div>
                
                <div className="text-sm text-gray-400 mb-2">
                  ⏰ {result.timestamp}
                </div>
                
                {result.success ? (
                  <div className="text-green-400">
                    <div>📡 Status: Succès</div>
                    {result.data?.data && (
                      <div>📊 Données: {Array.isArray(result.data.data) ? result.data.data.length : 1} élément(s)</div>
                    )}
                    {result.data?.pagination && (
                      <div>📄 Total: {result.data.pagination.total}</div>
                    )}
                    {result.data?.anime_info && (
                      <div>🎬 Anime: {result.data.anime_info.title}</div>
                    )}
                  </div>
                ) : (
                  <div className="text-red-400">
                    <div>❌ Erreur: {result.error}</div>
                  </div>
                )}
                
                {result.data && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-gray-400 hover:text-white">
                      📋 Voir la réponse complète
                    </summary>
                    <pre className="mt-2 text-xs text-gray-300 bg-gray-800 p-2 rounded overflow-auto max-h-40">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center text-sm text-gray-400">
            <div>🎯 Tests terminés: {testResults.length}</div>
            <div>✅ Succès: {testResults.filter(r => r.success).length}</div>
            <div>❌ Échecs: {testResults.filter(r => !r.success).length}</div>
          </div>
        </div>
      )}

      <div className="text-center text-sm text-gray-500">
        <p>💡 Ce composant teste toutes les nouvelles routes backend pour valider la migration</p>
        <p>🔧 Utilisez ces tests pour vérifier que les routes fonctionnent avant de déployer</p>
      </div>
    </div>
  );
};

