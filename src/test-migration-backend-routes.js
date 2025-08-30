// Test de migration vers les routes backend
// Ce script teste les nouvelles routes API backend

const API_BASE = 'https://app.ty-dev.fr';
const API_VERSION = 'v1';

// Test des nouvelles routes backend
async function testBackendRoutes() {
  console.log('🧪 Test des nouvelles routes backend...\n');
  
  const testSlug = 'demon-slayer-kimetsu-no-yaiba-hashira-training-arc-dub';
  const testId = '68af989a7ae01b4811dc2356'; // ID de test
  
  // Test 1: Route episodes latest
  console.log('1️⃣ Test GET /api/v1/episodes/latest');
  try {
    const response = await fetch(`${API_BASE}/api/${API_VERSION}/episodes/latest`);
    const data = await response.json();
    
    if (data.success) {
      console.log('   ✅ Succès - Épisodes trouvés:', data.data?.length || 0);
      console.log('   📊 Count:', data.count);
    } else {
      console.log('   ❌ Échec:', data.message);
    }
  } catch (error) {
    console.log('   ❌ Erreur:', error.message);
  }
  
  // Test 2: Route episodes search
  console.log('\n2️⃣ Test GET /api/v1/episodes/search?q=demon');
  try {
    const response = await fetch(`${API_BASE}/api/${API_VERSION}/episodes/search?q=demon`);
    const data = await response.json();
    
    if (data.success) {
      console.log('   ✅ Succès - Résultats trouvés:', data.data?.length || 0);
      console.log('   🔍 Query:', data.query);
    } else {
      console.log('   ❌ Échec:', data.message);
    }
  } catch (error) {
    console.log('   ❌ Erreur:', error.message);
  }
  
  // Test 3: Route episodes par slug d'anime
  console.log('\n3️⃣ Test GET /api/v1/episodes/anime/slug/:slug');
  try {
    const response = await fetch(`${API_BASE}/api/${API_VERSION}/episodes/anime/slug/${testSlug}`);
    const data = await response.json();
    
    if (data.success) {
      console.log('   ✅ Succès - Épisodes trouvés:', data.data?.length || 0);
      console.log('   📺 Total:', data.pagination?.total);
      console.log('   🎬 Anime:', data.anime_info?.title);
    } else {
      console.log('   ❌ Échec:', data.message);
    }
  } catch (error) {
    console.log('   ❌ Erreur:', error.message);
  }
  
  // Test 4: Route episodes par ID d'anime
  console.log('\n4️⃣ Test GET /api/v1/episodes/anime/:animeId');
  try {
    const response = await fetch(`${API_BASE}/api/${API_VERSION}/episodes/anime/${testId}`);
    const data = await response.json();
    
    if (data.success) {
      console.log('   ✅ Succès - Épisodes trouvés:', data.data?.length || 0);
      console.log('   📺 Total:', data.pagination?.total);
      console.log('   🎬 Anime:', data.anime_info?.title);
    } else {
      console.log('   ❌ Échec:', data.message);
    }
  } catch (error) {
    console.log('   ❌ Erreur:', error.message);
  }
  
  // Test 5: Route épisode spécifique
  console.log('\n5️⃣ Test GET /api/v1/episodes/anime/:animeId/episode/:episodeNumber');
  try {
    const response = await fetch(`${API_BASE}/api/${API_VERSION}/episodes/anime/${testSlug}/episode/1`);
    const data = await response.json();
    
    if (data.success) {
      console.log('   ✅ Succès - Épisode trouvé');
      console.log('   📺 Numéro:', data.data?.episode_number);
      console.log('   🎬 Titre:', data.data?.title);
    } else {
      console.log('   ❌ Échec:', data.message);
    }
  } catch (error) {
    console.log('   ❌ Erreur:', error.message);
  }
  
  // Test 6: Route tous les épisodes avec filtres
  console.log('\n6️⃣ Test GET /api/v1/episodes (avec filtres)');
  try {
    const response = await fetch(`${API_BASE}/api/${API_VERSION}/episodes?limit=5&sort=air_date&order=desc`);
    const data = await response.json();
    
    if (data.success) {
      console.log('   ✅ Succès - Épisodes trouvés:', data.data?.length || 0);
      console.log('   📊 Pagination:', data.pagination);
      console.log('   🔧 Filtres:', data.filters);
    } else {
      console.log('   ❌ Échec:', data.message);
    }
  } catch (error) {
    console.log('   ❌ Erreur:', error.message);
  }
  
  // Test 7: Route anime par slug
  console.log('\n7️⃣ Test GET /api/v1/anime/slug/:slug');
  try {
    const response = await fetch(`${API_BASE}/api/${API_VERSION}/anime/slug/${testSlug}`);
    const data = await response.json();
    
    if (data.success) {
      console.log('   ✅ Succès - Anime trouvé');
      console.log('   🎬 Titre:', data.data?.title);
      console.log('   🏷️ Slug:', data.data?.slug);
    } else {
      console.log('   ❌ Échec:', data.message);
    }
  } catch (error) {
    console.log('   ❌ Erreur:', error.message);
  }
  
  // Test 8: Route anime par ID
  console.log('\n8️⃣ Test GET /api/v1/anime/id/:id');
  try {
    const response = await fetch(`${API_BASE}/api/${API_VERSION}/anime/id/${testId}`);
    const data = await response.json();
    
    if (data.success) {
      console.log('   ✅ Succès - Anime trouvé');
      console.log('   🎬 Titre:', data.data?.title);
      console.log('   🆔 ID:', data.data?._id);
    } else {
      console.log('   ❌ Échec:', data.message);
    }
  } catch (error) {
    console.log('   ❌ Erreur:', error.message);
  }
}

// Test des anciennes routes directes (pour comparaison)
async function testDirectRoutes() {
  console.log('\n🔍 Test des anciennes routes directes (pour comparaison)...\n');
  
  const testSlug = 'demon-slayer-kimetsu-no-yaiba-hashira-training-arc-dub';
  
  // Test route directe
  console.log('📍 Test GET /anime/:slug/episodes (route directe)');
  try {
    const response = await fetch(`${API_BASE}/anime/${testSlug}/episodes`);
    const data = await response.json();
    
    if (data.success) {
      console.log('   ✅ Succès - Épisodes trouvés:', data.data?.length || 0);
      console.log('   📺 Total:', data.pagination?.total);
    } else {
      console.log('   ❌ Échec:', data.message);
    }
  } catch (error) {
    console.log('   ❌ Erreur:', error.message);
  }
}

// Exécution des tests
async function runAllTests() {
  console.log('🚀 Démarrage des tests de migration vers les routes backend...\n');
  
  await testBackendRoutes();
  await testDirectRoutes();
  
  console.log('\n🎯 Résumé des tests terminé !');
  console.log('📋 Vérifiez que toutes les nouvelles routes backend fonctionnent correctement.');
}

runAllTests().catch(console.error);
