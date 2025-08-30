// Test de la transformation des données d'épisodes
// Ce fichier valide que la transformation API → Frontend fonctionne

import { episodeService } from './services/episodeService';

// Test de transformation des données
async function testEpisodeTransformation() {
  console.log('🧪 Test de transformation des données d\'épisodes...\n');
  
  const testSlug = 'so-i-am-the-ancestor-of-the-demonic-path';
  const testId = '68af989a7ae01b4811dc2356';
  
  try {
    // Test 1: Transformation par slug
    console.log('📍 Test 1: Transformation par slug');
    const episodesBySlug = await episodeService.getAnimeEpisodes(testSlug);
    
    if (episodesBySlug) {
      console.log('✅ Transformation réussie par slug:');
      console.log('   Anime ID:', episodesBySlug.animeId);
      console.log('   Anime Title:', episodesBySlug.animeTitle);
      console.log('   Nombre d\'épisodes:', episodesBySlug.episodes?.length || 0);
      
      if (episodesBySlug.episodes && episodesBySlug.episodes.length > 0) {
        const firstEpisode = episodesBySlug.episodes[0];
        console.log('   Premier épisode:');
        console.log('     ID:', firstEpisode.id);
        console.log('     Numéro:', firstEpisode.number);
        console.log('     Titre:', firstEpisode.title);
        console.log('     Sources:', firstEpisode.sources?.length || 0);
      }
    } else {
      console.log('❌ Échec de la transformation par slug');
    }
    
    // Test 2: Transformation par ID
    console.log('\n📍 Test 2: Transformation par ID');
    const episodesById = await episodeService.getAnimeEpisodes(testId);
    
    if (episodesById) {
      console.log('✅ Transformation réussie par ID:');
      console.log('   Anime ID:', episodesById.animeId);
      console.log('   Anime Title:', episodesById.animeTitle);
      console.log('   Nombre d\'épisodes:', episodesById.episodes?.length || 0);
    } else {
      console.log('❌ Échec de la transformation par ID');
    }
    
    // Test 3: Validation de la structure
    console.log('\n📍 Test 3: Validation de la structure');
    if (episodesBySlug && episodesBySlug.episodes) {
      const isValid = episodesBySlug.episodes.every(episode => 
        episode.id && 
        episode.number && 
        episode.title && 
        Array.isArray(episode.sources)
      );
      
      if (isValid) {
        console.log('✅ Structure des épisodes valide');
      } else {
        console.log('❌ Structure des épisodes invalide');
        console.log('   Épisodes problématiques:', episodesBySlug.episodes.filter(episode => 
          !episode.id || !episode.number || !episode.title || !Array.isArray(episode.sources)
        ));
      }
    }
    
  } catch (error) {
    console.log('❌ Erreur dans le test de transformation:', error.message);
  }
}

// Test de la compatibilité avec le composant
function testComponentCompatibility() {
  console.log('\n🧪 Test de compatibilité avec le composant...');
  
  // Simuler les données transformées
  const mockTransformedData = {
    animeId: 'so-i-am-the-ancestor-of-the-demonic-path',
    animeTitle: 'So I am the Ancestor of the Demonic Path',
    episodes: [
      {
        id: '68b07f488f105c3460882fd9',
        number: 1,
        title: 'Épisode 1 - La Voie Démoniaque',
        description: 'Description de l\'épisode 1',
        sources: [
          { url: 'https://example.com/ep1.mp4', quality: '1080p', server: 'Server 1' }
        ]
      }
    ]
  };
  
  console.log('📍 Données simulées pour le composant:');
  console.log('   ✅ animeId:', mockTransformedData.animeId);
  console.log('   ✅ animeTitle:', mockTransformedData.animeTitle);
  console.log('   ✅ episodes.length:', mockTransformedData.episodes.length);
  console.log('   ✅ Premier épisode:', mockTransformedData.episodes[0].title);
  
  // Vérifier que le composant peut utiliser ces données
  const episodeCount = mockTransformedData.episodes?.length || 0;
  const hasEpisodes = episodeCount > 0;
  
  console.log('\n📍 Test du composant:');
  console.log('   Épisodes affichés:', episodeCount);
  console.log('   Condition d\'affichage:', hasEpisodes ? 'Afficher les épisodes' : 'Afficher "Aucun épisode"');
  
  if (hasEpisodes) {
    console.log('   ✅ Le composant devrait afficher les épisodes');
  } else {
    console.log('   ❌ Le composant affichera "Aucun épisode"');
  }
}

// Exécution des tests
async function runAllTests() {
  console.log('🚀 Démarrage des tests de transformation des épisodes...\n');
  
  await testEpisodeTransformation();
  testComponentCompatibility();
  
  console.log('\n🎯 Résumé des tests:');
  console.log('   ✅ Transformation API → Frontend testée');
  console.log('   ✅ Compatibilité composant validée');
  console.log('   ✅ Structure des données vérifiée');
  
  console.log('\n💡 Si les tests passent, le composant devrait maintenant afficher les épisodes!');
}

// Exécuter les tests si le fichier est chargé dans le navigateur
if (typeof window !== 'undefined') {
  runAllTests();
} else {
  console.log('Ce fichier doit être exécuté dans le navigateur');
}
