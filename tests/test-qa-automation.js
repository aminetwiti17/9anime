// Script de test pour vérifier le bon fonctionnement du système d'analyse et de correction automatique

import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

// Configuration
const PROJECT_ROOT = process.cwd();
const SCREENSHOTS_DIR = path.join(PROJECT_ROOT, 'backend', 'tests', 'screenshots');
const ANALYSIS_LOGS = path.join(PROJECT_ROOT, 'tests', 'screenshot-analysis-logs.json');
const ANALYSIS_REPORT = path.join(PROJECT_ROOT, 'tests', 'screenshot-analysis-report.md');
const FIX_REPORT = path.join(PROJECT_ROOT, 'tests', 'auto-fix-report.md');

// Résultats des tests
const testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  tests: []
};

/**
 * Fonction principale de test
 */
async function runTests() {
  console.log('🧪 Démarrage des tests du système d\'analyse et de correction automatique...');
  
  try {
    // Test 1: Vérifier que les captures d'écran existent
    await runTest('Vérification des captures d\'écran', async () => {
      await fs.access(SCREENSHOTS_DIR);
      const { stdout } = await execPromise(`find ${SCREENSHOTS_DIR} -type f -name "*.png" | wc -l`);
      const count = parseInt(stdout.trim());
      if (count === 0) {
        throw new Error('Aucune capture d\'écran trouvée.');
      }
      return `${count} captures d'écran trouvées`;
    });
    
    // Test 2: Vérifier que le script d'analyse existe
    await runTest('Vérification du script d\'analyse', async () => {
      await fs.access(path.join(PROJECT_ROOT, 'tests', 'screenshot-analyzer.js'));
      return 'Script d\'analyse trouvé';
    });
    
    // Test 3: Vérifier que le script de correction existe
    await runTest('Vérification du script de correction', async () => {
      await fs.access(path.join(PROJECT_ROOT, 'tests', 'auto-fix-ui.js'));
      return 'Script de correction trouvé';
    });
    
    // Test 4: Vérifier que le script de workflow existe
    await runTest('Vérification du script de workflow', async () => {
      await fs.access(path.join(PROJECT_ROOT, 'tests', 'qa-auto-fix-workflow.js'));
      return 'Script de workflow trouvé';
    });
    
    // Test 5: Exécuter l'analyse des captures d'écran
    await runTest('Exécution de l\'analyse des captures d\'écran', async () => {
      await execPromise('node tests/screenshot-analyzer.js');
      await fs.access(ANALYSIS_LOGS);
      await fs.access(ANALYSIS_REPORT);
      
      // Vérifier que les logs contiennent des données valides
      const analysisData = JSON.parse(await fs.readFile(ANALYSIS_LOGS, 'utf8'));
      if (!analysisData.screenshotsAnalyzed || !analysisData.screenshots) {
        throw new Error('Les logs d\'analyse ne contiennent pas les données attendues.');
      }
      
      return `Analyse terminée: ${analysisData.screenshotsAnalyzed} captures d'écran analysées, ${analysisData.issuesDetected} problèmes détectés`;
    });
    
    // Test 6: Exécuter les corrections automatiques (uniquement si des problèmes ont été détectés)
    const analysisData = JSON.parse(await fs.readFile(ANALYSIS_LOGS, 'utf8'));
    
    if (analysisData.issuesDetected > 0) {
      await runTest('Exécution des corrections automatiques', async () => {
        await execPromise('node tests/auto-fix-ui.js');
        await fs.access(FIX_REPORT);
        
        // Vérifier que le rapport de correction existe
        const reportContent = await fs.readFile(FIX_REPORT, 'utf8');
        if (!reportContent.includes('Rapport des Corrections Automatiques')) {
          throw new Error('Le rapport de correction ne contient pas les données attendues.');
        }
        
        return 'Corrections automatiques terminées';
      });
    } else {
      testResults.skipped++;
      testResults.tests.push({
        name: 'Exécution des corrections automatiques',
        status: 'skipped',
        message: 'Aucun problème détecté, test ignoré'
      });
      console.log('⏭️  Test ignoré: Exécution des corrections automatiques (aucun problème détecté)');
    }
    
    // Test 7: Exécuter le workflow complet
    await runTest('Exécution du workflow complet', async () => {
      await execPromise('node tests/qa-auto-fix-workflow.js');
      await fs.access(path.join(PROJECT_ROOT, 'tests', 'qa-workflow-report.md'));
      return 'Workflow complet terminé';
    });
    
    // Afficher le résumé des tests
    displayTestSummary();
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution des tests:', error);
  }
}

/**
 * Exécute un test individuel
 * @param {string} name - Nom du test
 * @param {Function} testFn - Fonction de test
 */
async function runTest(name, testFn) {
  console.log(`🧪 Test: ${name}...`);
  
  try {
    const result = await testFn();
    testResults.passed++;
    testResults.tests.push({
      name,
      status: 'passed',
      message: result
    });
    console.log(`✅ Test réussi: ${name} - ${result}`);
  } catch (error) {
    testResults.failed++;
    testResults.tests.push({
      name,
      status: 'failed',
      message: error.message
    });
    console.error(`❌ Test échoué: ${name} - ${error.message}`);
  }
}

/**
 * Affiche le résumé des tests
 */
function displayTestSummary() {
  console.log('\n📋 Résumé des tests:');
  console.log(`✅ Tests réussis: ${testResults.passed}`);
  console.log(`❌ Tests échoués: ${testResults.failed}`);
  console.log(`⏭️  Tests ignorés: ${testResults.skipped}`);
  console.log(`📊 Total: ${testResults.passed + testResults.failed + testResults.skipped}`);
  
  if (testResults.failed > 0) {
    console.log('\n❌ Tests échoués:');
    testResults.tests
      .filter(test => test.status === 'failed')
      .forEach(test => {
        console.log(`   - ${test.name}: ${test.message}`);
      });
  }
  
  if (testResults.failed === 0) {
    console.log('\n✅ Tous les tests ont réussi!');
  }
}

// Exécuter les tests
runTests();