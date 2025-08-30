// Script de test pour une seule page avec Trae AI MCP
const fs = require('fs').promises;
const path = require('path');

// Configuration
const PAGE_URL = 'http://localhost:3000/'; // URL de la page à tester
const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');
const LOGS_FILE = path.join(__dirname, 'logs.json');

// Fonction principale
async function testPage() {
  console.log(`🚀 Test de la page: ${PAGE_URL}`);
  
  // S'assurer que le dossier de captures d'écran existe
  await ensureDirectoryExists(SCREENSHOTS_DIR);
  
  const results = {
    consoleErrors: [],
    visualIssues: [],
    buttonIssues: []
  };
  
  try {
    // 1. Naviguer vers la page
    console.log('🌐 Navigation vers la page...');
    await runMCP('mcp.config.usrremotemcp.Puppeteer', 'puppeteer_navigate', { 
      url: PAGE_URL
    });
    
    // 2. Attendre que la page soit chargée
    console.log('⏳ Attente du chargement complet...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 3. Prendre une capture d'écran
    console.log('📸 Capture d\'écran...');
    await runMCP('mcp.config.usrremotemcp.Puppeteer', 'puppeteer_screenshot', { 
      name: 'homepage-test.png'
    });
    
    // 4. Vérifier les erreurs console
    console.log('🔍 Vérification des erreurs console...');
    const consoleErrors = await runMCP('mcp.config.usrremotemcp.Puppeteer', 'puppeteer_evaluate', {
      script: `
        const errors = [];
        const originalConsoleError = console.error;
        console.error = function() {
          errors.push(Array.from(arguments).join(' '));
          originalConsoleError.apply(console, arguments);
        };
        return errors;
      `
    });
    
    if (consoleErrors && consoleErrors.length > 0) {
      console.log('⚠️ Erreurs console détectées:');
      consoleErrors.forEach(error => console.log(`- ${error}`));
      results.consoleErrors = consoleErrors;
    } else {
      console.log('✅ Aucune erreur console détectée');
    }
    
    // 5. Tester un clic sur un bouton
    console.log('🖱️ Test de clic sur un bouton...');
    try {
      await runMCP('mcp.config.usrremotemcp.Puppeteer', 'puppeteer_click', {
        selector: 'a.navbar-brand' // Exemple: clic sur le logo/brand
      });
      console.log('✅ Clic sur le bouton réussi');
    } catch (error) {
      console.error('❌ Erreur lors du clic sur le bouton:', error);
      results.buttonIssues.push({
        selector: 'a.navbar-brand',
        error: error.message
      });
    }
    
    // 6. Détecter les problèmes visuels
    console.log('🔍 Détection des problèmes visuels...');
    const visualIssues = await runMCP('mcp.config.usrremotemcp.Puppeteer', 'puppeteer_evaluate', {
      script: `
        const issues = [];
        const elements = document.querySelectorAll('*');
        
        for (const element of elements) {
          const rect = element.getBoundingClientRect();
          
          // Ignorer les éléments très petits ou invisibles
          if (rect.width < 10 || rect.height < 10) continue;
          
          // Vérifier les overflows horizontaux
          if (rect.right > window.innerWidth + 5) {
            issues.push({
              type: 'overflow-x',
              element: element.tagName + (element.id ? '#' + element.id : '') + 
                      (element.className ? '.' + element.className.replace(/ /g, '.') : ''),
              details: {
                right: rect.right,
                windowWidth: window.innerWidth,
                overflow: rect.right - window.innerWidth
              }
            });
          }
        }
        
        return issues;
      `
    });
    
    if (visualIssues && visualIssues.length > 0) {
      console.log('⚠️ Problèmes visuels détectés:');
      visualIssues.forEach(issue => {
        console.log(`- ${issue.element}: ${issue.type}`);
      });
      results.visualIssues = visualIssues;
    } else {
      console.log('✅ Aucun problème visuel détecté');
    }
    
    // Sauvegarder les résultats
    await fs.writeFile(LOGS_FILE, JSON.stringify(results, null, 2));
    
    console.log('✅ Test terminé avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
  }
}

// Fonction utilitaire pour s'assurer qu'un répertoire existe
async function ensureDirectoryExists(directory) {
  try {
    await fs.mkdir(directory, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

// Fonction utilitaire pour appeler MCP
async function runMCP(serverName, toolName, args) {
  console.log(`Appel MCP: ${toolName}`, args);
  // Cette fonction sera remplacée par l'appel réel à MCP dans Trae AI
  return {};
}

// Exécuter le test
testPage().catch(console.error);