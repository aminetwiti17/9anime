// Script d'intégration pour l'analyse des captures d'écran et l'application des corrections automatiques
// Ce script orchestre le workflow complet de QA automatisé

import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

// Configuration
const PROJECT_ROOT = process.cwd();
const SCREENSHOTS_DIR = path.join(PROJECT_ROOT, 'backend', 'tests', 'screenshots');
const ANALYSIS_REPORT = path.join(PROJECT_ROOT, 'tests', 'screenshot-analysis-report.md');
const ANALYSIS_LOGS = path.join(PROJECT_ROOT, 'tests', 'screenshot-analysis-logs.json');
const FIX_REPORT = path.join(PROJECT_ROOT, 'tests', 'auto-fix-report.md');
const FINAL_REPORT = path.join(PROJECT_ROOT, 'tests', 'qa-workflow-report.md');

/**
 * Fonction principale qui orchestre le workflow
 */
async function runQaWorkflow() {
  console.log('🚀 Démarrage du workflow QA automatisé...');
  
  try {
    // Étape 1: Vérifier que les captures d'écran existent
    await checkScreenshotsExist();
    
    // Étape 2: Exécuter l'analyse des captures d'écran
    await runScreenshotAnalysis();
    
    // Étape 3: Vérifier les résultats de l'analyse
    const analysisResults = await checkAnalysisResults();
    
    // Étape 4: Appliquer les corrections automatiques si des problèmes ont été détectés
    if (analysisResults.issuesDetected > 0) {
      await runAutoFix();
      
      // Étape 5: Vérifier les résultats des corrections
      const fixResults = await checkFixResults();
      
      // Étape 6: Générer un rapport final
      await generateFinalReport(analysisResults, fixResults);
    } else {
      console.log('✅ Aucun problème détecté, pas besoin de corrections.');
      await generateFinalReport(analysisResults, null);
    }
    
    console.log(`📝 Rapport final généré: ${FINAL_REPORT}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'exécution du workflow QA:', error);
  }
}

/**
 * Vérifie que les captures d'écran existent
 */
async function checkScreenshotsExist() {
  try {
    await fs.access(SCREENSHOTS_DIR);
    
    // Compter les captures d'écran
    const { stdout } = await execPromise(`find ${SCREENSHOTS_DIR} -type f -name "*.png" | wc -l`);
    const count = parseInt(stdout.trim());
    
    if (count === 0) {
      throw new Error('Aucune capture d\'écran trouvée.');
    }
    
    console.log(`📸 ${count} captures d'écran trouvées.`);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des captures d\'écran:', error);
    throw error;
  }
}

/**
 * Exécute l'analyse des captures d'écran
 */
async function runScreenshotAnalysis() {
  console.log('🔍 Exécution de l\'analyse des captures d\'écran...');
  
  try {
    // Exécuter le script d'analyse
    await execPromise('node tests/screenshot-analyzer.js');
    console.log('✅ Analyse des captures d\'écran terminée.');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse des captures d\'écran:', error);
    throw error;
  }
}

/**
 * Vérifie les résultats de l'analyse
 * @returns {Promise<Object>} Résultats de l'analyse
 */
async function checkAnalysisResults() {
  try {
    // Vérifier que le fichier de logs existe
    await fs.access(ANALYSIS_LOGS);
    
    // Charger les résultats
    const analysisData = JSON.parse(await fs.readFile(ANALYSIS_LOGS, 'utf8'));
    
    console.log(`📊 Analyse terminée: ${analysisData.screenshotsAnalyzed} captures d'écran analysées, ${analysisData.issuesDetected} problèmes détectés.`);
    
    return analysisData;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des résultats de l\'analyse:', error);
    throw error;
  }
}

/**
 * Exécute les corrections automatiques
 */
async function runAutoFix() {
  console.log('🔧 Application des corrections automatiques...');
  
  try {
    // Exécuter le script de correction
    await execPromise('node tests/auto-fix-ui.js');
    console.log('✅ Corrections automatiques terminées.');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'application des corrections automatiques:', error);
    throw error;
  }
}

/**
 * Vérifie les résultats des corrections
 * @returns {Promise<Object>} Résultats des corrections
 */
async function checkFixResults() {
  try {
    // Vérifier que le rapport de correction existe
    await fs.access(FIX_REPORT);
    
    // Lire le contenu du rapport (pour extraire les statistiques)
    const reportContent = await fs.readFile(FIX_REPORT, 'utf8');
    
    // Extraire les statistiques de base (approche simplifiée)
    const fixedMatch = reportContent.match(/Problèmes corrigés\*\*:\s*(\d+)/);
    const partiallyFixedMatch = reportContent.match(/Problèmes partiellement corrigés\*\*:\s*(\d+)/);
    const notFixedMatch = reportContent.match(/Problèmes non corrigés\*\*:\s*(\d+)/);
    
    const fixResults = {
      fixed: fixedMatch ? parseInt(fixedMatch[1]) : 0,
      partiallyFixed: partiallyFixedMatch ? parseInt(partiallyFixedMatch[1]) : 0,
      notFixed: notFixedMatch ? parseInt(notFixedMatch[1]) : 0
    };
    
    console.log(`📊 Corrections terminées: ${fixResults.fixed} problèmes corrigés, ${fixResults.partiallyFixed} partiellement corrigés, ${fixResults.notFixed} non corrigés.`);
    
    return fixResults;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification des résultats des corrections:', error);
    throw error;
  }
}

/**
 * Génère un rapport final
 * @param {Object} analysisResults - Résultats de l'analyse
 * @param {Object} fixResults - Résultats des corrections
 */
async function generateFinalReport(analysisResults, fixResults) {
  console.log('📝 Génération du rapport final...');
  
  const now = new Date().toLocaleString();
  
  let report = `# 📊 Rapport du Workflow QA Automatisé

`;
  report += `*Généré le ${now}*

`;
  
  // Résumé
  report += `## 📋 Résumé

`;
  report += `- **Captures d'écran analysées**: ${analysisResults.screenshotsAnalyzed}
`;
  report += `- **Problèmes détectés**: ${analysisResults.issuesDetected}
`;
  
  if (fixResults) {
    report += `- **Problèmes corrigés**: ${fixResults.fixed}
`;
    report += `- **Problèmes partiellement corrigés**: ${fixResults.partiallyFixed}
`;
    report += `- **Problèmes non corrigés**: ${fixResults.notFixed}
`;
    
    // Taux de réussite
    const totalIssues = analysisResults.issuesDetected;
    const fixRate = totalIssues > 0 ? Math.round((fixResults.fixed / totalIssues) * 100) : 0;
    const partialFixRate = totalIssues > 0 ? Math.round((fixResults.partiallyFixed / totalIssues) * 100) : 0;
    
    report += `- **Taux de correction complète**: ${fixRate}%
`;
    report += `- **Taux de correction partielle**: ${partialFixRate}%
`;
  }
  
  // Liens vers les rapports détaillés
  report += `
## 📄 Rapports Détaillés

`;
  report += `- [Rapport d'analyse des captures d'écran](${path.relative(PROJECT_ROOT, ANALYSIS_REPORT)})
`;
  
  if (fixResults) {
    report += `- [Rapport des corrections automatiques](${path.relative(PROJECT_ROOT, FIX_REPORT)})
`;
  }
  
  // Étapes suivantes
  report += `
## 🔜 Étapes Suivantes

`;
  
  if (fixResults && (fixResults.partiallyFixed > 0 || fixResults.notFixed > 0)) {
    report += `### Problèmes nécessitant une intervention manuelle

`;
    report += `${fixResults.partiallyFixed + fixResults.notFixed} problème(s) n'ont pas été entièrement corrigés automatiquement et nécessitent une intervention manuelle. Consultez le rapport d'analyse pour plus de détails.

`;
  }
  
  report += `### Recommandations

`;
  report += `- Vérifier visuellement les corrections appliquées
`;
  report += `- Exécuter des tests manuels sur les pages corrigées
`;
  report += `- Mettre à jour les guidelines de design pour éviter ces problèmes à l'avenir
`;
  
  // Pied de page
  report += `\n---\n\n*Rapport généré automatiquement par le workflow QA automatisé*`;
  
  // Sauvegarder le rapport
  await fs.writeFile(FINAL_REPORT, report);
}

// Exécuter le workflow
runQaWorkflow();