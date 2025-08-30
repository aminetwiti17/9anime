// Script d'exécution pour les tests QA Frontend
import { run_mcp } from '../src/utils/mcp-helper.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Obtenir le chemin du répertoire actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const BASE_URL = 'http://localhost:3000'; // À ajuster selon l'URL de votre site
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
const LOGS_FILE = path.join(__dirname, 'logs.json');

// Pages principales à tester
const PAGES_TO_TEST = [
  { name: 'home', path: '/' },
  { name: 'anime-list', path: '/anime' },
  { name: 'search', path: '/search?q=naruto' },
  // Ajoutez d'autres pages selon votre site
];

// Résolutions pour les tests
const RESOLUTIONS = {
  desktop: { width: 1920, height: 1080 },
  mobile: { width: 375, height: 812 }
};

async function runTests() {
  console.log('🚀 Démarrage des tests QA Frontend avec Puppeteer + MCP...');
  
  try {
    // Vérifier que le dossier screenshots existe
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }
    
    // Initialiser le fichier de logs
    const testResults = {
      timestamp: new Date().toISOString(),
      pages: [],
      errors: []
    };
    
    // Tester chaque page
    for (const page of PAGES_TO_TEST) {
      console.log(`\n📄 Test de la page: ${page.name}`);
      const pageResult = { name: page.name, path: page.path, screenshots: [], issues: [] };
      
      // Tester dans chaque résolution
      for (const [deviceType, viewport] of Object.entries(RESOLUTIONS)) {
        console.log(`🖥️  Résolution: ${deviceType} (${viewport.width}x${viewport.height})`);
        
        try {
          // Naviguer vers la page
          await run_mcp('puppeteer_navigate', {
            url: `${BASE_URL}${page.path}`,
            launchOptions: {
              headless: false,
              args: ['--no-sandbox']
            }
          });
          
          // Définir la taille de la fenêtre
          console.log(`📏 Définition de la taille: ${viewport.width}x${viewport.height}`);
          await run_mcp('puppeteer_evaluate', {
            script: `
              window.resizeTo(${viewport.width}, ${viewport.height});
              document.documentElement.style.overflow = 'auto';
            `
          });
          
          // Attendre que la page soit chargée
          console.log('⏳ Attente du chargement complet...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Prendre une capture d'écran
          console.log('📸 Capture d\'écran...');
          const screenshotName = `${page.name}-${deviceType}.png`;
          const screenshotResult = await run_mcp('puppeteer_screenshot', {
            name: screenshotName,
            width: viewport.width,
            height: viewport.height
          });
          
          pageResult.screenshots.push({
            deviceType,
            path: `./screenshots/${screenshotName}`
          });
          
          // Capturer les erreurs console
          console.log('🔍 Vérification des erreurs console...');
          const consoleErrors = await run_mcp('puppeteer_evaluate', {
            script: `
              return window.errors || [];
            `
          });
          
          if (consoleErrors && consoleErrors.length > 0) {
            pageResult.issues.push({
              type: 'console',
              deviceType,
              errors: consoleErrors
            });
          }
          
          // Vérifier les problèmes d'interface
          console.log('🔍 Vérification des problèmes d\'interface...');
          const uiIssues = await run_mcp('puppeteer_evaluate', {
            script: `
              const issues = [];
              
              // Vérifier les débordements horizontaux
              if (document.body.scrollWidth > window.innerWidth) {
                issues.push({
                  type: 'overflow',
                  message: 'Débordement horizontal détecté',
                  details: 'La page dépasse la largeur de la fenêtre'
                });
              }
              
              // Vérifier les boutons et liens
              const clickables = Array.from(document.querySelectorAll('button, a, [role="button"]'));
              for (const el of clickables) {
                const rect = el.getBoundingClientRect();
                const style = window.getComputedStyle(el);
                
                // Vérifier si l'élément est visible
                if (rect.width === 0 || rect.height === 0 || style.display === 'none' || style.visibility === 'hidden') {
                  issues.push({
                    type: 'button',
                    element: el.tagName + (el.id ? '#' + el.id : '') + (el.className ? '.' + el.className.replace(/\s+/g, '.') : ''),
                    text: el.textContent.trim(),
                    message: 'Élément cliquable non visible'
                  });
                }
                // Vérifier si l'élément est trop petit
                else if (rect.width < 20 || rect.height < 20) {
                  issues.push({
                    type: 'button',
                    element: el.tagName + (el.id ? '#' + el.id : '') + (el.className ? '.' + el.className.replace(/\s+/g, '.') : ''),
                    text: el.textContent.trim(),
                    message: 'Élément cliquable trop petit'
                  });
                }
              }
              
              return issues;
            `
          });
          
          if (uiIssues && uiIssues.length > 0) {
            pageResult.issues.push({
              type: 'ui',
              deviceType,
              issues: uiIssues
            });
          }
          
          console.log(`✅ Test de ${page.name} en ${deviceType} terminé`);
          
        } catch (error) {
          console.error(`❌ Erreur lors du test de ${page.name} en ${deviceType}:`, error);
          pageResult.issues.push({
            type: 'error',
            deviceType,
            message: error.message,
            stack: error.stack
          });
          testResults.errors.push({
            page: page.name,
            deviceType,
            message: error.message
          });
        }
      }
      
      testResults.pages.push(pageResult);
    }
    
    // Sauvegarder les résultats
    fs.writeFileSync(LOGS_FILE, JSON.stringify(testResults, null, 2));
    console.log(`\n📊 Résultats sauvegardés dans ${LOGS_FILE}`);
    
    // Générer le rapport
    await generateReport(testResults);
    
  } catch (error) {
    console.error('❌ Erreur globale:', error);
  }
}

// Fonction pour générer le rapport
async function generateReport(results) {
  console.log('\n📝 Génération du rapport...');
  
  const reportPath = path.join(__dirname, 'report.md');
  let report = `# Rapport de QA Frontend

## Date: ${new Date().toLocaleString()}

`;
  
  // Résumé
  report += '## Résumé\n\n';
  const totalPages = results.pages.length;
  const pagesWithIssues = results.pages.filter(p => p.issues.length > 0).length;
  report += `- **Pages testées**: ${totalPages}\n`;
  report += `- **Pages avec problèmes**: ${pagesWithIssues}\n`;
  report += `- **Erreurs globales**: ${results.errors.length}\n\n`;
  
  // Captures d'écran
  report += '## Captures d\'écran\n\n';
  for (const page of results.pages) {
    report += `### ${page.name}\n\n`;
    for (const screenshot of page.screenshots) {
      report += `- **${screenshot.deviceType}**: ![${page.name}-${screenshot.deviceType}](${screenshot.path})\n`;
    }
    report += '\n';
  }
  
  // Problèmes détectés
  report += '## Problèmes détectés\n\n';
  
  for (const page of results.pages) {
    if (page.issues.length > 0) {
      report += `### ${page.name}\n\n`;
      
      // Regrouper par type de problème
      const consoleIssues = page.issues.filter(i => i.type === 'console');
      const uiIssues = page.issues.filter(i => i.type === 'ui');
      const errors = page.issues.filter(i => i.type === 'error');
      
      // Erreurs console
      if (consoleIssues.length > 0) {
        report += '#### Erreurs Console\n\n';
        for (const issue of consoleIssues) {
          report += `**${issue.deviceType}**:\n\n`;
          for (const error of issue.errors) {
            report += `- ${error}\n`;
          }
          report += '\n';
        }
      }
      
      // Problèmes d'interface
      if (uiIssues.length > 0) {
        report += '#### Problèmes d\'Interface\n\n';
        for (const issue of uiIssues) {
          report += `**${issue.deviceType}**:\n\n`;
          for (const ui of issue.issues) {
            report += `- **${ui.element || 'Page'}**: ${ui.message}${ui.text ? ` ("${ui.text}")` : ''}${ui.details ? ` - ${ui.details}` : ''}\n`;
          }
          report += '\n';
        }
      }
      
      // Erreurs techniques
      if (errors.length > 0) {
        report += '#### Erreurs Techniques\n\n';
        for (const error of errors) {
          report += `**${error.deviceType}**: ${error.message}\n\n`;
        }
      }
    }
  }
  
  // Recommandations
  report += '## Recommandations\n\n';
  report += '1. Corriger les erreurs console pour améliorer la stabilité\n';
  report += '2. Ajuster les éléments d\'interface qui débordent ou sont trop petits\n';
  report += '3. Optimiser le responsive design pour les appareils mobiles\n';
  report += '4. Vérifier les performances de chargement des pages\n';
  
  // Écrire le rapport
  fs.writeFileSync(reportPath, report);
  console.log(`📄 Rapport généré: ${reportPath}`);
}

// Fonction utilitaire pour appeler MCP
async function run_mcp(toolName, args) {
  console.log(`Appel MCP: ${toolName}`, args);
  // Cette fonction sera remplacée par l'appel réel à MCP dans Trae AI
  return {};
}

// Exécuter les tests
runTests().catch(console.error);