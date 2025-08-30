// Script de démonstration du système d'analyse et de correction automatique des problèmes UI
// Ce script montre comment utiliser les différents composants du système

import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

// Configuration
const PROJECT_ROOT = process.cwd();
const SCREENSHOTS_DIR = path.join(PROJECT_ROOT, 'backend', 'tests', 'screenshots');

/**
 * Fonction principale de démonstration
 */
async function runDemo() {
  console.log('🚀 Démarrage de la démonstration du système d\'analyse et de correction automatique...');
  console.log('📋 Cette démonstration va vous montrer comment utiliser les différents composants du système.');
  
  try {
    // Étape 1: Vérifier que les captures d'écran existent
    await checkScreenshots();
    
    // Étape 2: Présenter les options disponibles
    await presentOptions();
    
  } catch (error) {
    console.error('❌ Erreur lors de la démonstration:', error);
  }
}

/**
 * Vérifie que les captures d'écran existent
 */
async function checkScreenshots() {
  try {
    await fs.access(SCREENSHOTS_DIR);
    
    // Compter les captures d'écran
    const { stdout } = await execPromise(`find ${SCREENSHOTS_DIR} -type f -name "*.png" | wc -l`);
    const count = parseInt(stdout.trim());
    
    if (count === 0) {
      console.log('⚠️ Aucune capture d\'écran trouvée. Veuillez d\'abord générer des captures d\'écran.');
      console.log('💡 Vous pouvez utiliser les scripts de test existants pour générer des captures d\'écran.');
      process.exit(1);
    }
    
    console.log(`📸 ${count} captures d'écran trouvées dans ${SCREENSHOTS_DIR}.`);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des captures d\'écran:', error);
    console.log('💡 Assurez-vous que le répertoire des captures d\'écran existe et est accessible.');
    throw error;
  }
}

/**
 * Présente les options disponibles
 */
async function presentOptions() {
  console.log('\n📋 Options disponibles:');
  console.log('1️⃣  Analyser les captures d\'écran uniquement');
  console.log('2️⃣  Appliquer les corrections automatiques uniquement');
  console.log('3️⃣  Exécuter le workflow complet (analyse + corrections)');
  console.log('4️⃣  Afficher l\'aide');
  console.log('5️⃣  Quitter');
  
  // Dans un environnement interactif, on demanderait à l'utilisateur de choisir une option
  // Mais comme ce script est exécuté en mode non interactif, on affiche simplement les commandes à utiliser
  
  console.log('\n💡 Pour exécuter une option, utilisez les commandes suivantes:');
  console.log('\n📊 Pour analyser les captures d\'écran uniquement:');
  console.log('   node tests/screenshot-analyzer.js');
  
  console.log('\n🔧 Pour appliquer les corrections automatiques uniquement:');
  console.log('   node tests/auto-fix-ui.js');
  
  console.log('\n🚀 Pour exécuter le workflow complet (analyse + corrections):');
  console.log('   node tests/qa-auto-fix-workflow.js');
  
  console.log('\n📚 Pour plus d\'informations, consultez la documentation:');
  console.log('   cat tests/README-QA-AUTOMATION.md');
  
  console.log('\n✨ Exemple d\'utilisation du workflow complet:');
  console.log('```bash');
  console.log('# Générer des captures d\'écran (si nécessaire)');
  console.log('node tests/run-tests.js');
  console.log('');
  console.log('# Exécuter le workflow d\'analyse et de correction');
  console.log('node tests/qa-auto-fix-workflow.js');
  console.log('');
  console.log('# Consulter le rapport final');
  console.log('cat tests/qa-workflow-report.md');
  console.log('```');
}

// Exécuter la démonstration
runDemo();