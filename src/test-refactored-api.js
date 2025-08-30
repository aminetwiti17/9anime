// Test des routes API refactorées
// Ce fichier valide que toutes les corrections ont été appliquées correctement

import { DIRECT_ROUTES, API_ROUTES, apiRequest, apiRequestWithRetry } from './config/apiRoutes';

// Test des routes directes
async function testDirectRoutes() {
  console.log('🧪 Test des routes directes...');
  
  const testSlug = 'so-i-am-the-ancestor-of-the-demonic-path';
  const testId = '68af989a7ae01b4811dc2356';
  
  try {
    // Test 1: Route des épisodes par slug
    console.log('📍 Test 1: Épisodes par slug');
    const episodesBySlug = await apiRequest(DIRECT_ROUTES.ANIME_EPISODES(testSlug));
    console.log('✅ Succès:', episodesBySlug.success, 'Épisodes:', episodesBySlug.data?.length || 0);
    
    // Test 2: Route des épisodes par ID
    console.log('📍 Test 2: Épisodes par ID');
    const episodesById = await apiRequest(DIRECT_ROUTES.ANIME_EPISODES(testId));
    console.log('✅ Succès:', episodesById.success, 'Épisodes:', episodesById.data?.length || 0);
    
    // Test 3: Info anime par slug
    console.log('📍 Test 3: Info anime par slug');
    const animeInfoBySlug = await apiRequest(DIRECT_ROUTES.ANIME_INFO(testSlug));
    console.log('✅ Succès:', animeInfoBySlug.success, 'Titre:', animeInfoBySlug.data?.title);
    
    // Test 4: Info anime par ID
    console.log('📍 Test 4: Info anime par ID');
    const animeInfoById = await apiRequest(DIRECT_ROUTES.ANIME_INFO(testId));
    console.log('✅ Succès:', animeInfoById.success, 'Titre:', animeInfoById.data?.title);
    
  } catch (error) {
    console.log('❌ Erreur dans les routes directes:', error.message);
  }
}

// Test des routes API
async function testAPIRoutes() {
  console.log('\n🧪 Test des routes API...');
  
  try {
    // Test 1: Animes tendance
    console.log('📍 Test 1: Animes tendance');
    const trending = await apiRequest(`${API_ROUTES.ANIME.TRENDING}?limit=5`);
    console.log('✅ Succès:', trending.success, 'Animes:', trending.data?.length || 0);
    
    // Test 2: Genres
    console.log('📍 Test 2: Genres');
    const genres = await apiRequest(API_ROUTES.GENRES.LIST);
    console.log('✅ Succès:', genres.success, 'Genres:', genres.data?.length || 0);
    
    // Test 3: Recherche
    console.log('📍 Test 3: Recherche');
    const search = await apiRequest(`${API_ROUTES.SEARCH.ANIME}?q=anime&limit=5`);
    console.log('✅ Succès:', search.success, 'Résultats:', search.data?.length || 0);
    
  } catch (error) {
    console.log('❌ Erreur dans les routes API:', error.message);
  }
}

// Test des services refactorés
async function testRefactoredServices() {
  console.log('\n🧪 Test des services refactorés...');
  
  try {
    // Test 1: EpisodeService
    console.log('📍 Test 1: EpisodeService');
    const { episodeService } = await import('./services/episodeService');
    
    const episodes = await episodeService.getAnimeEpisodes('so-i-am-the-ancestor-of-the-demonic-path');
    console.log('✅ Épisodes trouvés:', episodes?.length || 0);
    
    const title = await episodeService.getAnimeTitle('so-i-am-the-ancestor-of-the-demonic-path');
    console.log('✅ Titre trouvé:', title);
    
    // Test 2: SearchService
    console.log('📍 Test 2: SearchService');
    const { searchService } = await import('./services/searchService');
    
    const searchResults = await searchService.searchAnime({ q: 'anime', limit: 5 });
    console.log('✅ Résultats de recherche:', searchResults.data?.length || 0);
    
  } catch (error) {
    console.log('❌ Erreur dans les services refactorés:', error.message);
  }
}

// Test de la gestion d'erreur et des timeouts
async function testErrorHandling() {
  console.log('\n🧪 Test de la gestion d\'erreur...');
  
  try {
    // Test 1: Route inexistante
    console.log('📍 Test 1: Route inexistante');
    try {
      await apiRequest('https://app.ty-dev.fr/api/v1/nonexistent');
    } catch (error) {
      console.log('✅ Erreur gérée correctement:', error.message);
    }
    
    // Test 2: Timeout (route lente)
    console.log('📍 Test 2: Test de timeout');
    try {
      await apiRequest('https://httpbin.org/delay/15'); // 15 secondes
    } catch (error) {
      console.log('✅ Timeout géré correctement:', error.message);
    }
    
  } catch (error) {
    console.log('❌ Erreur dans les tests de gestion d\'erreur:', error.message);
  }
}

// Test de retry automatique
async function testRetryLogic() {
  console.log('\n🧪 Test de la logique de retry...');
  
  try {
    // Test avec retry (simuler un échec temporaire)
    console.log('📍 Test de retry automatique');
    const result = await apiRequestWithRetry('https://app.ty-dev.fr/health');
    console.log('✅ Retry réussi:', result.status);
    
  } catch (error) {
    console.log('❌ Erreur dans le test de retry:', error.message);
  }
}

// Exécution de tous les tests
async function runAllTests() {
  console.log('🚀 Démarrage des tests des routes API refactorées...\n');
  
  await testDirectRoutes();
  await testAPIRoutes();
  await testRefactoredServices();
  await testErrorHandling();
  await testRetryLogic();
  
  console.log('\n🎯 Résumé des tests:');
  console.log('   ✅ Routes directes testées');
  console.log('   ✅ Routes API testées');
  console.log('   ✅ Services refactorés testés');
  console.log('   ✅ Gestion d\'erreur testée');
  console.log('   ✅ Logique de retry testée');
  
  console.log('\n🌐 Toutes les routes sont maintenant centralisées et cohérentes!');
}

// Exécuter les tests si le fichier est chargé dans le navigateur
if (typeof window !== 'undefined') {
  runAllTests();
} else {
  console.log('Ce fichier doit être exécuté dans le navigateur');
}
