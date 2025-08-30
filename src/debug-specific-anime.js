// Debug spécifique pour l'anime "the-beginning-of-journey"
// Ce script diagnostique pourquoi les épisodes ne sont pas récupérés

const ANIME_SLUG = 'the-beginning-of-journey';
const API_BASE = 'https://app.ty-dev.fr';

async function debugSpecificAnime() {
  console.log('🔍 Debug spécifique pour:', ANIME_SLUG);
  
  try {
    // Test 1: Appel direct à l'API
    console.log('\n📍 Test 1: Appel direct à l\'API');
    const url = `${API_BASE}/anime/${ANIME_SLUG}/episodes`;
    console.log('URL testée:', url);
    
    const response = await fetch(url);
    console.log('Status:', response.status);
    console.log('OK:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('📡 Réponse API complète:', data);
      
      if (data.success) {
        console.log('✅ API retourne success: true');
        console.log('📊 Nombre d\'épisodes dans data:', data.data?.length || 0);
        console.log('📋 Épisodes:', data.data);
        console.log('ℹ️ Info anime:', data.anime_info);
      } else {
        console.log('❌ API retourne success: false');
        console.log('💬 Message:', data.message);
      }
    } else {
      console.log('❌ Erreur HTTP:', response.status, response.statusText);
    }
    
    // Test 2: Vérifier si l'anime existe
    console.log('\n📍 Test 2: Vérifier l\'existence de l\'anime');
    const animeUrl = `${API_BASE}/anime/${ANIME_SLUG}`;
    console.log('URL anime:', animeUrl);
    
    const animeResponse = await fetch(animeUrl);
    console.log('Status anime:', animeResponse.status);
    
    if (animeResponse.ok) {
      const animeData = await animeResponse.json();
      console.log('📺 Données anime:', animeData);
    } else {
      console.log('❌ Anime non trouvé');
    }
    
    // Test 3: Tester avec le service
    console.log('\n📍 Test 3: Test avec le service transformé');
    try {
      const { episodeService } = await import('./services/episodeService');
      const serviceData = await episodeService.getAnimeEpisodes(ANIME_SLUG);
      console.log('🔄 Données du service:', serviceData);
      
      if (serviceData) {
        console.log('✅ Service retourne des données');
        console.log('📊 Épisodes transformés:', serviceData.episodes?.length || 0);
      } else {
        console.log('❌ Service retourne null');
      }
    } catch (error) {
      console.log('❌ Erreur service:', error.message);
    }
    
  } catch (error) {
    console.log('❌ Erreur générale:', error.message);
  }
}

// Test alternatif avec un slug qui fonctionne
async function testWorkingSlug() {
  console.log('\n🧪 Test avec un slug qui fonctionne...');
  
  const workingSlug = 'so-i-am-the-ancestor-of-the-demonic-path';
  const url = `${API_BASE}/anime/${workingSlug}/episodes`;
  
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Slug fonctionnel:', workingSlug);
      console.log('📊 Épisodes:', data.data?.length || 0);
    }
  } catch (error) {
    console.log('❌ Erreur avec slug fonctionnel:', error.message);
  }
}

// Exécution des tests
async function runDebug() {
  console.log('🚀 Démarrage du debug spécifique...\n');
  
  await debugSpecificAnime();
  await testWorkingSlug();
  
  console.log('\n🎯 Résumé du debug:');
  console.log('   🔍 Anime testé:', ANIME_SLUG);
  console.log('   📡 Réponse API analysée');
  console.log('   🔄 Service testé');
  console.log('   ✅ Slug alternatif testé');
}

// Exécuter si dans le navigateur
if (typeof window !== 'undefined') {
  runDebug();
} else {
  console.log('Ce fichier doit être exécuté dans le navigateur');
}
